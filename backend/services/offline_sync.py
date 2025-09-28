import json
from datetime import datetime
from firebase_config import db

class OfflineSyncService:
    @staticmethod
    def sync_offline_data(farmer_uid, offline_data):
        """Sincronizar datos offline con Firebase"""
        try:
            results = {
                'synced': [],
                'failed': [],
                'conflicts': []
            }
            
            for item in offline_data:
                try:
                    if item['type'] == 'lot_creation':
                        # Crear lote desde datos offline
                        lot_data = item['data']
                        lot = Lot(
                            farmer_uid=farmer_uid,
                            crop_type=lot_data['crop_type'],
                            quantity=float(lot_data['quantity']),
                            unit=lot_data.get('unit', 'kg'),
                            location=lot_data.get('location')
                        )
                        lot.created_at = datetime.fromisoformat(item['timestamp'])
                        lot.save()
                        results['synced'].append({
                            'type': 'lot_creation',
                            'id': lot.id,
                            'offline_id': item.get('offline_id')
                        })
                    
                    elif item['type'] == 'lot_update':
                        # Actualizar lote
                        lot_id = item['lot_id']
                        update_data = item['data']
                        
                        # Verificar si hay conflictos
                        current_lot = Lot.get_by_id(lot_id)
                        if current_lot:
                            server_updated = current_lot['updated_at']
                            client_updated = datetime.fromisoformat(item['timestamp'])
                            
                            if server_updated > client_updated:
                                # Conflicto: el servidor tiene una versión más reciente
                                results['conflicts'].append({
                                    'type': 'lot_update',
                                    'lot_id': lot_id,
                                    'server_version': current_lot,
                                    'client_version': update_data
                                })
                            else:
                                # Actualizar con datos del cliente
                                db.collection('lots').document(lot_id).update(update_data)
                                results['synced'].append({
                                    'type': 'lot_update',
                                    'lot_id': lot_id
                                })
                        else:
                            results['failed'].append({
                                'type': 'lot_update',
                                'lot_id': lot_id,
                                'error': 'Lote no encontrado'
                            })
                    
                    elif item['type'] == 'lot_deletion':
                        # Eliminar lote
                        lot_id = item['lot_id']
                        db.collection('lots').document(lot_id).update({
                            'status': 'deleted',
                            'updated_at': datetime.fromisoformat(item['timestamp'])
                        })
                        results['synced'].append({
                            'type': 'lot_deletion',
                            'lot_id': lot_id
                        })
                
                except Exception as e:
                    results['failed'].append({
                        'item': item,
                        'error': str(e)
                    })
            
            return results, 200
            
        except Exception as e:
            return {'error': str(e)}, 500
    
    @staticmethod
    def resolve_conflict(lot_id, resolution_strategy='server'):
        """Resolver conflictos de sincronización"""
        # resolution_strategy: 'server', 'client', 'merge'
        # Implementar lógica de resolución según estrategia
        pass