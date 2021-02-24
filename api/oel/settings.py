"""
Django settings for oel project.

Generated by 'django-admin startproject' using Django 3.1.1.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""

import os
from pathlib import Path
from corsheaders.defaults import default_headers
from oel.celery import app

_ = app


def get_env_variable(var_name, default=None):
    try:
        return os.environ[var_name]
    except KeyError:
        if default is not None:
            return default
        error_msg = "Set the %s environment variable" % var_name
        raise ImproperlyConfigured(error_msg)


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_ROOT = '/opt/static'

ENV = get_env_variable('FC_ENV', 'dev')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = ENV != 'prod'


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '&a^3x)^55jcxa(j&pt)n1=p8)7qk@b5452u8#*u1_t-n@jd=j_'


ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'django_celery_beat',
    'api.apps.ApiConfig',
    'django_filters',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    "api.middleware.org.org_middleware"
]

ROOT_URLCONF = 'oel.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'oelui')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'oel.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': get_env_variable('OEL_DB_NAME', ''),
        'USER': get_env_variable('OEL_USERNAME', ''),
        'PASSWORD': get_env_variable('OEL_PASSWORD', ''),
        'HOST': get_env_variable('OEL_HOSTNAME', ''),
        'PORT': get_env_variable('OEL_PORT', ''),
        'TEST': {
            'NAME': 'auto_tests',
        }
    }
}


# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.' \
                'UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.' \
            'MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.' \
            'CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.' \
            'NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True


REST_FRAMEWORK = {
    'PAGE_SIZE': 100,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend'
    ],
    'DEFAULT_PERMISSION_CLASSES': tuple(),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
}

# Django CORS and CSRF
# https://github.com/OttoYiu/django-cors-headers
CORS_ORIGIN_ALLOW_ALL = True

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = list(default_headers) + [
    'WWW-AUTHORIZATION',
    'HTTP_WWW_AUTHORIZATION',
    'X-Fancontent-User',
    'Authorization'
]

CORS_EXPOSE_HEADERS = [
    'Content-Disposition'
]

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = ()

# OnErrorLog Environment Configuration

BROKER_URL = os.environ.get('BROKER_URL', 'redis://localhost:6379')
CELERY_RESULT_BACKEND = os.environ.get(
    'CELERY_RESULT_BACKEND',
    'redis://localhost:6379'
)
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_CREATE_MISSING_QUEUES = True

EMAIL_HOST_USER = get_env_variable('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = get_env_variable('EMAIL_HOST_PASSWORD', '')
EMAIL_HOST = get_env_variable('EMAIL_HOST', '')
EMAIL_PORT = int(get_env_variable('EMAIL_PORT', '587'))
EMAIL_USE_TLS = get_env_variable('EMAIL_USE_TLS', '').lower() == 'true'
DEFAULT_FROM_EMAIL = get_env_variable('DEFAULT_FROM_EMAIL', '')

TWILIO_SID = get_env_variable('TWILIO_SID', '')
TWILIO_AUTH_TOKEN = get_env_variable('TWILIO_AUTH_TOKEN', '')
TWILIO_PHONE = get_env_variable('TWILIO_PHONE', '')

REDIS_HOST = BROKER_URL.split('/')[-1].split(':')[0]

# Application Settings
ALLOW_GENERIC_EMAILS = os.environ.get('ALLOW_GENERIC_EMAILS', True)

SECS_BETWEEN_PONGS = 10
PONG_DATA_MAX_LEN = 16384


