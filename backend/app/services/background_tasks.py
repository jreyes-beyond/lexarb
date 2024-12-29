from fastapi import BackgroundTasks
from typing import List
from app.services.email_processor import EmailProcessor
from app.core.config import settings
import aioredis
import asyncio

class BackgroundTaskManager:
    def __init__(self):
        self.redis = aioredis.from_url(settings.REDIS_URL)
        self.email_processor = EmailProcessor()
        self.running = False
    
    async def start_processing(self):
        """Start background processing of emails"""
        self.running = True
        while self.running:
            try:
                await self.email_processor.process_email_queue(
                    background_tasks=BackgroundTasks()
                )
                await asyncio.sleep(10)  # Check queue every 10 seconds
            except Exception as e:
                print(f"Error processing email queue: {e}")
                await asyncio.sleep(30)  # Wait longer on error
    
    async def stop_processing(self):
        """Stop background processing"""
        self.running = False

# Global task manager instance
task_manager = BackgroundTaskManager()