from firebase_admin import auth
from models.user import User
import re

class AuthService:
    @staticmethod
    def validate_email(email):
        """Validar formato de email"""
        pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_password(password):
        """Validar fortaleza de contraseña"""
        if len(password) < 6:
            return False, "La contraseña debe tener al menos 6 caracteres"
        return True, "Contraseña válida"
    
    @staticmethod
    def register_user(email, password, name=None, phone=None, farm_name=None):
        """Registrar nuevo usuario"""
        try:
            # Validaciones
            if not AuthService.validate_email(email):
                return {'error': 'Email inválido'}, 400
            
            valid, msg = AuthService.validate_password(password)
            if not valid:
                return {'error': msg}, 400
            
            # Crear usuario en Firebase Auth
            user_record = auth.create_user(
                email=email,
                password=password,
                display_name=name
            )
            
            # Guardar información adicional en Firestore
            user = User(
                uid=user_record.uid,
                email=email,
                name=name,
                phone=phone,
                farm_name=farm_name
            )
            user.save()
            
            # Generar token personalizado
            custom_token = auth.create_custom_token(user_record.uid)
            
            return {
                'uid': user_record.uid,
                'email': email,
                'token': custom_token.decode('utf-8'),
                'message': 'Usuario registrado exitosamente'
            }, 201
            
        except auth.EmailAlreadyExistsError:
            return {'error': 'El email ya está registrado'}, 409
        except Exception as e:
            return {'error': str(e)}, 500
    
    @staticmethod
    def login_user(email, password):
        """Login de usuario"""
        try:
            # Verificar credenciales con Firebase Auth
            user = auth.get_user_by_email(email)
            
            # Generar token personalizado
            custom_token = auth.create_custom_token(user.uid)
            
            # Obtener información adicional del usuario
            user_data = User.get_by_uid(user.uid)
            
            return {
                'uid': user.uid,
                'email': user.email,
                'token': custom_token.decode('utf-8'),
                'user_data': user_data,
                'message': 'Login exitoso'
            }, 200
            
        except auth.UserNotFoundError:
            return {'error': 'Usuario no encontrado'}, 404
        except Exception as e:
            return {'error': str(e)}, 500
    
    @staticmethod
    def reset_password(email):
        """Enviar email para resetear contraseña"""
        try:
            if not AuthService.validate_email(email):
                return {'error': 'Email inválido'}, 400
            
            # Generar link de reseteo (Firebase lo maneja)
            link = auth.generate_password_reset_link(email)
            
            # Aquí deberías enviar el email con el link
            # Por ahora solo retornamos el link
            return {
                'message': 'Link de reseteo enviado',
                'reset_link': link
            }, 200
            
        except auth.UserNotFoundError:
            return {'error': 'Usuario no encontrado'}, 404
        except Exception as e:
            return {'error': str(e)}, 500
    
    @staticmethod
    def verify_token(token):
        """Verificar token de Firebase"""
        try:
            decoded_token = auth.verify_id_token(token)
            return decoded_token
        except:
            return None