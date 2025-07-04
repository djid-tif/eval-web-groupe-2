const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { Pool } = require('pg');
const axios = require('axios');

// Load the proto file
const protoPath = path.join(__dirname, 'notification.proto');
const packageDefinition = protoLoader.loadSync(protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const notificationProto = grpc.loadPackageDefinition(packageDefinition).notification;

// Database connection
const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    database: process.env.POSTGRES_DB || 'pgdb',
    user: process.env.POSTGRES_USER || 'pguser',
    password: process.env.POSTGRES_PASSWORD || 'pgpass',
});

// Export Service Implementation
const exportService = {
    ExportReservations: async (call, callback) => {
        try {
            const { userId } = call.request;
            console.log(`Export request for user ${userId}`);
            
            // Call the REST API to generate CSV
            const response = await axios.post(
                `http://localhost:3000/api/users/${userId}/extract`,
                {},
                {
                    headers: {
                        'Authorization': 'Bearer dummy-token-for-grpc' // Simplified for testing
                    }
                }
            );

            callback(null, { url: response.data.url });
        } catch (error) {
            console.error('Export error:', error.message);
            callback({
                code: grpc.status.INTERNAL,
                message: 'Failed to export reservations'
            });
        }
    }
};

// Notification Service Implementation
const notificationService = {
    CreateNotification: async (call, callback) => {
        try {
            const { reservationId, message, notificationDate } = call.request;
            console.log(`Creating notification for reservation ${reservationId}`);
            
            // Insert notification into database
            const result = await pool.query(
                'INSERT INTO notifications (reservation_id, message, type, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
                [reservationId, message, 'created', new Date(notificationDate)]
            );

            const notification = result.rows[0];
            callback(null, {
                id: notification.id,
                reservationId: notification.reservation_id,
                message: notification.message,
                notificationDate: notification.created_at.toISOString()
            });
        } catch (error) {
            console.error('CreateNotification error:', error.message);
            callback({
                code: grpc.status.INTERNAL,
                message: 'Failed to create notification'
            });
        }
    },

    UpdateNotification: async (call, callback) => {
        try {
            const { id, message, notificationDate } = call.request;
            console.log(`Updating notification ${id}`);
            
            // Update notification in database
            const result = await pool.query(
                'UPDATE notifications SET message = $1, created_at = $2 WHERE id = $3 RETURNING *',
                [message, new Date(notificationDate), id]
            );

            if (result.rows.length === 0) {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: 'Notification not found'
                });
                return;
            }

            const notification = result.rows[0];
            callback(null, {
                id: notification.id,
                reservationId: notification.reservation_id,
                message: notification.message,
                notificationDate: notification.created_at.toISOString()
            });
        } catch (error) {
            console.error('UpdateNotification error:', error.message);
            callback({
                code: grpc.status.INTERNAL,
                message: 'Failed to update notification'
            });
        }
    },

    GetNotification: async (call, callback) => {
        try {
            const { id } = call.request;
            console.log(`Getting notification ${id}`);
            
            // Get notification from database
            const result = await pool.query(
                'SELECT * FROM notifications WHERE id = $1',
                [id]
            );

            if (result.rows.length === 0) {
                callback({
                    code: grpc.status.NOT_FOUND,
                    message: 'Notification not found'
                });
                return;
            }

            const notification = result.rows[0];
            callback(null, {
                id: notification.id,
                reservationId: notification.reservation_id,
                message: notification.message,
                notificationDate: notification.created_at.toISOString()
            });
        } catch (error) {
            console.error('GetNotification error:', error.message);
            callback({
                code: grpc.status.INTERNAL,
                message: 'Failed to get notification'
            });
        }
    },

    SendNotification: async (call, callback) => {
        try {
            const { reservationId, message, type } = call.request;
            console.log(`Sending notification for reservation ${reservationId}`);
            
            // Insert notification into database
            const result = await pool.query(
                'INSERT INTO notifications (reservation_id, message, type, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
                [reservationId, message, type]
            );

            callback(null, { success: true, message: 'Notification sent successfully' });
        } catch (error) {
            console.error('SendNotification error:', error.message);
            callback({
                code: grpc.status.INTERNAL,
                message: 'Failed to send notification'
            });
        }
    },

    GetNotifications: async (call, callback) => {
        try {
            const { reservationId } = call.request;
            console.log(`Getting notifications for reservation ${reservationId}`);
            
            const result = await pool.query(
                'SELECT * FROM notifications WHERE reservation_id = $1 ORDER BY created_at DESC',
                [reservationId]
            );

            const notifications = result.rows.map(row => ({
                id: row.id,
                reservationId: row.reservation_id,
                message: row.message,
                type: row.type,
                createdAt: row.created_at.toISOString()
            }));

            callback(null, { notifications });
        } catch (error) {
            console.error('GetNotifications error:', error.message);
            callback({
                code: grpc.status.INTERNAL,
                message: 'Failed to get notifications'
            });
        }
    }
};

// Create and start the server
function startServer() {
    const server = new grpc.Server();
    
    server.addService(notificationProto.ExportService.service, exportService);
    server.addService(notificationProto.NotificationService.service, notificationService);
    
    const port = '0.0.0.0:50051';
    server.bindAsync(port, grpc.ServerCredentials.createInsecure(), (err, bindPort) => {
        if (err) {
            console.error('Failed to bind server:', err);
            return;
        }
        
        console.log(`gRPC server started on ${port}`);
        server.start();
    });
}

if (require.main === module) {
    startServer();
}

module.exports = { startServer }; 