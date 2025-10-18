from fastapi import WebSocket
from typing import Dict, List


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, chat_id: int):
        await websocket.accept()
        if chat_id not in self.active_connections:
            self.active_connections[chat_id] = []
        self.active_connections[chat_id].append(websocket)

    def disconnect(self, websocket: WebSocket, chat_id: int):
        if chat_id in self.active_connections:
            self.active_connections[chat_id].remove(websocket)
            if not self.active_connections[chat_id]:
                del self.active_connections[chat_id]

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast_to_chat(self, message: str, chat_id: int):
        if chat_id in self.active_connections:
            disconnected = []
            for connection in self.active_connections[chat_id]:
                try:
                    await connection.send_text(message)
                except Exception:
                    disconnected.append(connection)

            for connection in disconnected:
                self.disconnect(connection, chat_id)


manager = ConnectionManager()