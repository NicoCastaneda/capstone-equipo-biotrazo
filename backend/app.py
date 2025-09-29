from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from services.auth_service import AuthService
from services.lot_service import LotService
from services.offline_sync import OfflineSyncService
import firebase_admin
from firebase_admin import auth
from functools import wraps
from datetime import datetime
import os

# Crear aplicación Flask
app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Crear directorio para QR codes si no existe
os.makedirs(Config.QR_CODES_PATH, exist_ok=True)

# ===================== DECORADOR DE AUTENTICACIÓN =====================
def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Token no proporcionado'}), 401

        id_token = auth_header.split(" ")[1]

        try:
            decoded_token = auth.verify_id_token(id_token)
            request.user = decoded_token
        except Exception as e:
            return jsonify({'error': 'Token inválido', 'details': str(e)}), 401

        return f(*args, **kwargs)
    return decorated_function

# ===================== RUTAS DE AUTENTICACIÓN =====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Registrar nuevo agricultor"""
    data = request.json
    response, status = AuthService.register_user(
        email=data.get('email'),
        password=data.get('password'),
        name=data.get('name'),
        phone=data.get('phone'),
        farm_name=data.get('farm_name')
    )
    return jsonify(response), status

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login de agricultor"""
    data = request.json
    response, status = AuthService.login_user(
        email=data.get('email'),
        password=data.get('password')
    )
    return jsonify(response), status

@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    """Recuperar contraseña"""
    data = request.get_json()
    
    if not data.get('email'):
        return jsonify({'error': 'Email es obligatorio'}), 400
    
    result, status_code = AuthService.reset_password(data['email'])
    return jsonify(result), status_code

# ===================== RUTAS DE GESTIÓN DE LOTES =====================

@app.route('/api/lots', methods=['POST'])
@require_auth
def create_lot():
    """Crear nuevo lote"""
    data = request.get_json()
    farmer_uid = request.user['uid']
    
    result, status_code = LotService.create_lot(farmer_uid, data)
    return jsonify(result), status_code

@app.route('/api/lots', methods=['GET'])
@require_auth
def get_lots():
    """Obtener todos los lotes del agricultor"""
    farmer_uid = request.user['uid']
    include_deleted = request.args.get('include_deleted', 'false').lower() == 'true'
    
    result, status_code = LotService.get_farmer_lots(farmer_uid, include_deleted)
    return jsonify(result), status_code

# ... (el resto de tus rutas siguen igual, ya con @require_auth funcionando)

# ===================== INICIALIZACIÓN =====================
if __name__ == '__main__':
    app.run(debug=True, port=5000)
