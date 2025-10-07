import uuid
from datetime import datetime
from firebase_admin import firestore
from firebase_config import db
import qrcode
import json
import base64
from io import BytesIO

class Lot:
    def __init__(self, farmer_uid, crop_type, quantity, unit='kg', location=None, 
                 certifications=None, price=None, currency='COP', sustainability_metrics=None):
        self.id = str(uuid.uuid4())
        self.farmer_uid = farmer_uid
        self.crop_type = crop_type
        self.quantity = quantity
        self.unit = unit
        self.location = location
        self.status = 'active'
        self.qr_code = None
        self.traceability_code = self.generate_traceability_code()
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        self.harvest_date = None
        self.events = []
        
        # ⬇️ AGREGAR ESTOS CAMPOS NUEVOS:
        self.certifications = certifications or []
        self.price = price or 0
        self.currency = currency or 'COP'
        self.sustainability_metrics = sustainability_metrics or {
            'carbonSaved': 0,
            'waterSaved': 0,
            'emissionsReduced': 0
        }
    
    def to_dict(self):
        """Convertir a diccionario serializable para Firestore"""
        return {
            'id': self.id,
            'farmer_uid': self.farmer_uid,
            'crop_type': self.crop_type,
            'quantity': self.quantity,
            'unit': self.unit,
            'location': self.location,
            'status': self.status,
            'qr_code': self.qr_code,
            'traceability_code': self.traceability_code,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'harvest_date': self.harvest_date,
            'events': self.events,
            # ⬇️ AGREGAR ESTOS CAMPOS:
            'certifications': self.certifications,
            'price': self.price,
            'currency': self.currency,
            'sustainability_metrics': self.sustainability_metrics
        }
    
    def save(self):
        """Guardar lote en Firestore"""
        try:
            if not self.qr_code:
                self.generate_qr()
            
            # Guardar en Firestore
            db.collection('lots').document(self.id).set(self.to_dict())
            print(f"✅ Lote guardado exitosamente: {self.id}")
            return self
        except Exception as e:
            print(f"❌ Error al guardar lote: {str(e)}")
            raise e
    
    def update(self, data):
        """Actualizar lote"""
        allowed_fields = ['crop_type', 'quantity', 'unit', 'location', 'status', 'harvest_date']
        update_data = {k: v for k, v in data.items() if k in allowed_fields}
        update_data['updated_at'] = datetime.utcnow()
        
        db.collection('lots').document(self.id).update(update_data)
        return self
    
    def delete(self):
        """Eliminar lote (soft delete)"""
        db.collection('lots').document(self.id).update({
            'status': 'deleted',
            'updated_at': datetime.utcnow()
        })
    
    def add_event(self, event_type, description, metadata=None):
        """Agregar evento de trazabilidad"""
        event = {
            'id': str(uuid.uuid4()),
            'type': event_type,
            'description': description,
            'metadata': metadata or {},
            'timestamp': datetime.utcnow()
        }
        
        # Usar ArrayUnion correctamente
        db.collection('lots').document(self.id).update({
            'events': firestore.ArrayUnion([event])
        })
        return event
    
    @staticmethod
    def get_by_id(lot_id):
        """Obtener lote por ID"""
        try:
            doc = db.collection('lots').document(lot_id).get()
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            print(f"❌ Error al obtener lote: {str(e)}")
            return None
    
    @staticmethod
    def get_by_farmer(farmer_uid, include_deleted=False):
        """Obtener todos los lotes de un agricultor"""
        try:
            query = db.collection('lots').where('farmer_uid', '==', farmer_uid)
            
            if not include_deleted:
                query = query.where('status', '==', 'active')
            
            docs = query.stream()
            lots = []
            for doc in docs:
                lot_data = doc.to_dict()
                lot_data['id'] = doc.id  # Asegurar que tenga el ID
                lots.append(lot_data)
            
            print(f"✅ Encontrados {len(lots)} lotes para farmer {farmer_uid}")
            return lots
        except Exception as e:
            print(f"❌ Error al obtener lotes: {str(e)}")
            return []