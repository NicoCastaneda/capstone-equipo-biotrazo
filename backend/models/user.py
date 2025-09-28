from datetime import datetime
from firebase_config import db

class User:
    def __init__(self, uid, email, name=None, phone=None, farm_name=None):
        self.uid = uid
        self.email = email
        self.name = name
        self.phone = phone
        self.farm_name = farm_name
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    def to_dict(self):
        return {
            'uid': self.uid,
            'email': self.email,
            'name': self.name,
            'phone': self.phone,
            'farm_name': self.farm_name,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'role': 'farmer'
        }
    
    def save(self):
        """Guardar usuario en Firestore"""
        db.collection('users').document(self.uid).set(self.to_dict())
        return self
    
    @staticmethod
    def get_by_uid(uid):
        """Obtener usuario por UID"""
        doc = db.collection('users').document(uid).get()
        return doc.to_dict() if doc.exists else None