from models.lot import Lot
from firebase_config import db
from datetime import datetime

class LotService:
    @staticmethod
    def validate_lot_data(data):
        """Validar datos del lote"""
        errors = []
        
        # Campos obligatorios
        required_fields = ['crop_type', 'quantity']
        for field in required_fields:
            if field not in data or not data[field]:
                errors.append(f"El campo {field} es obligatorio")
        
        # Validar cantidad
        if 'quantity' in data:
            try:
                quantity = float(data['quantity'])
                if quantity <= 0:
                    errors.append("La cantidad debe ser mayor a 0")
            except:
                errors.append("La cantidad debe ser un número válido")
        
        return errors
    
    @staticmethod
    def create_lot(farmer_uid, data):
        """Crear nuevo lote"""
        try:
            # Validar datos
            errors = LotService.validate_lot_data(data)
            if errors:
                return {'errors': errors}, 400
            
            # Crear lote
            lot = Lot(
                farmer_uid=farmer_uid,
                crop_type=data['crop_type'],
                quantity=float(data['quantity']),
                unit=data.get('unit', 'kg'),
                location=data.get('location')
            )
            
            # Agregar fecha de cosecha si se proporciona
            if 'harvest_date' in data:
                lot.harvest_date = datetime.fromisoformat(data['harvest_date'])
            
            # Guardar lote
            lot.save()
            
            # Agregar evento inicial
            lot.add_event(
                event_type='creation',
                description='Lote creado',
                metadata={'initial_quantity': lot.quantity}
            )
            
            return {
                'message': 'Lote creado exitosamente',
                'lot': lot.to_dict()
            }, 201
            
        except Exception as e:
            return {'error': str(e)}, 500
    
    @staticmethod
    def update_lot(lot_id, farmer_uid, data):
        """Actualizar lote"""
        try:
            # Verificar que el lote existe y pertenece al agricultor
            lot_data = Lot.get_by_id(lot_id)
            if not lot_data:
                return {'error': 'Lote no encontrado'}, 404
            
            if lot_data['farmer_uid'] != farmer_uid:
                return {'error': 'No autorizado'}, 403
            
            # Validar datos si se están actualizando campos críticos
            if 'crop_type' in data or 'quantity' in data:
                errors = LotService.validate_lot_data({
                    'crop_type': data.get('crop_type', lot_data['crop_type']),
                    'quantity': data.get('quantity', lot_data['quantity'])
                })
                if errors:
                    return {'errors': errors}, 400
            
            # Actualizar lote
            update_data = {}
            allowed_fields = ['crop_type', 'quantity', 'unit', 'location', 'status', 'harvest_date']
            
            for field in allowed_fields:
                if field in data:
                    if field == 'harvest_date':
                        update_data[field] = datetime.fromisoformat(data[field])
                    elif field == 'quantity':
                        update_data[field] = float(data[field])
                    else:
                        update_data[field] = data[field]
            
            update_data['updated_at'] = datetime.utcnow()
            
            db.collection('lots').document(lot_id).update(update_data)
            
            # Agregar evento de actualización
            db.collection('lots').document(lot_id).update({
                'events': firestore.ArrayUnion([{
                    'id': str(uuid.uuid4()),
                    'type': 'update',
                    'description': 'Lote actualizado',
                    'metadata': {'updated_fields': list(update_data.keys())},
                    'timestamp': datetime.utcnow()
                }])
            })
            
            return {
                'message': 'Lote actualizado exitosamente',
                'lot_id': lot_id
            }, 200
            
        except Exception as e:
            return {'error': str(e)}, 500
    
    @staticmethod
    def delete_lot(lot_id, farmer_uid):
        """Eliminar lote (soft delete)"""
        try:
            # Verificar que el lote existe y pertenece al agricultor
            lot_data = Lot.get_by_id(lot_id)
            if not lot_data:
                return {'error': 'Lote no encontrado'}, 404
            
            if lot_data['farmer_uid'] != farmer_uid:
                return {'error': 'No autorizado'}, 403
            
            # Soft delete
            db.collection('lots').document(lot_id).update({
                'status': 'deleted',
                'updated_at': datetime.utcnow()
            })
            
            # Agregar evento de eliminación
            db.collection('lots').document(lot_id).update({
                'events': firestore.ArrayUnion([{
                    'id': str(uuid.uuid4()),
                    'type': 'deletion',
                    'description': 'Lote eliminado',
                    'timestamp': datetime.utcnow()
                }])
            })
            
            return {'message': 'Lote eliminado exitosamente'}, 200
            
        except Exception as e:
            return {'error': str(e)}, 500
    
    @staticmethod
    def get_lot(lot_id, farmer_uid=None):
        """Obtener un lote específico"""
        try:
            lot_data = Lot.get_by_id(lot_id)
            if not lot_data:
                return {'error': 'Lote no encontrado'}, 404
            
            # Verificar permisos si se proporciona farmer_uid
            if farmer_uid and lot_data['farmer_uid'] != farmer_uid:
                return {'error': 'No autorizado'}, 403
            
            return {'lot': lot_data}, 200
            
        except Exception as e:
            return {'error': str(e)}, 500
    
    @staticmethod
    def get_farmer_lots(farmer_uid, include_deleted=False):
        """Obtener todos los lotes de un agricultor"""
        try:
            lots = Lot.get_by_farmer(farmer_uid, include_deleted)
            return {
                'lots': lots,
                'total': len(lots)
            }, 200
            
        except Exception as e:
            return {'error': str(e)}, 500
