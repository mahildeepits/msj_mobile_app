// import { useAuthStore } from '../stores/authStore';
// import { useCoinSettingsStore, useCoinStore } from '../stores/CoinStore';
// import { useGeneralStore } from '../stores/GeneralStore';
import { io } from 'socket.io-client';
import config from './config';
import { useRatesStore } from './ratesStore';

/**
 * This service is responsible for managing WebSocket communication with the backend server.
 * It handles connection, reconnection, and event handling for real-time data updates.
 */
class SocketService {
    socket:any  = null;
    reconnectAttempts = 0;
    maxReconnectAttempts = 5;
    reconnectTimeout = 5000; // 5 seconds
    isConnecting = false;
    eventHandlers:any = {};

    /**
     * Connect to the WebSocket server using the provided URL
     * Handles authentication and sets up event listeners
     */
    connect() {
        // Prevent multiple simultaneous connection attempts
        if (this.isConnecting) {
            console.log('Connection already in progress, skipping');
            return;
        }

        // Clean up any existing socket connection first
        this.disconnect();

        this.isConnecting = true;
       

        try {
            // Initialize socket.io connection
            this.socket = io(config.LiveSocketURL, {   // Connects to a Socket.IO server
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: this.maxReconnectAttempts,
                reconnectionDelay: this.reconnectTimeout,
                timeout: 20000,
            });

            // Register event handlers using our safe method
            this.registerHandler('connect', () => {
                console.log('Socket.io connected');
                this.reconnectAttempts = 0;
                this.isConnecting = false;

                
                // Subscribe to relevant data channels
                this.socket.emit('subscribe', { channel: 'rates' });
            });

            this.registerHandler('rates', (data:any) => {
                try {
                    useRatesStore.getState().updateRates(data);
                } catch (error) {
                    console.error('Error processing rates data:', error);
                }
            });

           

            this.registerHandler('disconnect', (reason:any) => {
                console.log('Socket.io disconnected:', reason);
                this.isConnecting = false;
                this.handleReconnect();
            });

            this.registerHandler('connect_error', (error:any) => {
                console.error('Socket.io connection error:', error);
                this.isConnecting = false;
            });

            this.registerHandler('error', (error:any) => {
                console.error('Socket.io error:', error);
            });

            console.log('Socket.io connection initialized');
        } catch (error) {
            console.error('Error initializing socket.io:', error);
            this.handleReconnect();
        }
    }

    /**
     * Safely register an event handler with the socket
     * Keeps track of all handlers for proper cleanup
     * @param event The socket event name
     * @param handler The event handler function
     */
    registerHandler(event:string, handler:any) {
        if (!this.socket) return;

        // Initialize the handlers array for this event if it doesn't exist
        if (!this.eventHandlers[event]) {
            this.eventHandlers[event] = [];
        }

        // Store the handler reference for later cleanup
        this.eventHandlers[event].push(handler);

        // Register the handler with the socket
        this.socket.on(event, handler);
    }

    /**
     * Remove all event handlers for a specific event
     * @param event The socket event name
     */
    removeAllHandlers(event:any) {
        if (!this.socket || !this.eventHandlers[event]) return;

        // Remove each handler for this event
        this.eventHandlers[event].forEach((handler:any) => {
            this.socket.off(event, handler);
        });

        // Clear the handlers array
        this.eventHandlers[event] = [];
    }

    /**
     * Handle reconnection attempts with exponential backoff
     */
    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = this.reconnectTimeout * Math.pow(1.5, this.reconnectAttempts - 1);
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms...`);

            setTimeout(() => this.connect(), delay);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }


    /**
     * Disconnect from the socket server and clean up all event handlers
     */
    disconnect() {
        if (this.socket) {
            // Clean up all registered event handlers
            Object.keys(this.eventHandlers).forEach(event => {
                this.removeAllHandlers(event);
            });

            // Reset event handlers tracking
            this.eventHandlers = {};

            // Disconnect the socket
            this.socket.disconnect();
            this.socket = null;
            this.isConnecting = false;
            console.log('Socket disconnected and all handlers cleaned up');
        }
    }
}

// Create and export a singleton instance
export const socketService = new SocketService();
