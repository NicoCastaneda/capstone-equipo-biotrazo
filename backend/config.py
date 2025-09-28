import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    FIREBASE_CREDENTIALS_PATH = os.environ.get('FIREBASE_CREDENTIALS_PATH', 'firebase-credentials.json')
    FIREBASE_DATABASE_URL = os.environ.get('FIREBASE_DATABASE_URL')
    QR_CODES_PATH = os.environ.get('QR_CODES_PATH', 'qr_codes')

