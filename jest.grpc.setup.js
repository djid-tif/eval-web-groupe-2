// Jest setup file for gRPC tests
process.env.PROTO_PATH = 'notification.proto';
process.env.PROTO_URL = 'localhost:50051';

// Database Configuration
process.env.POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost';
process.env.POSTGRES_PORT = process.env.POSTGRES_PORT || '5432';
process.env.POSTGRES_DB = process.env.POSTGRES_DB || 'pgdb';
process.env.POSTGRES_USER = process.env.POSTGRES_USER || 'pguser';
process.env.POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'pgpass';

// Keycloak Configuration
process.env.KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8080';
process.env.KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'myrealm';
process.env.KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID || 'myclient';

// API URLs
process.env.API_REST_URL = process.env.API_REST_URL || 'http://localhost:3000';
process.env.API_GRAPHQL_URL = process.env.API_GRAPHQL_URL || 'http://localhost:3000/graphql';

console.log('gRPC Test Environment Variables Set:');
console.log('PROTO_PATH:', process.env.PROTO_PATH);
console.log('PROTO_URL:', process.env.PROTO_URL); 