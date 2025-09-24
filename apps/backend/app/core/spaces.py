import boto3
from botocore.exceptions import ClientError
from typing import Optional
import uuid
from datetime import datetime, timedelta

from app.core.config import settings


class DigitalOceanSpaces:
    def __init__(self):
        self.spaces_client = boto3.client(
            's3',
            endpoint_url=settings.DO_SPACES_ENDPOINT,
            aws_access_key_id=settings.DIGITAL_OCEAN_ACCESS_KEY,
            aws_secret_access_key=settings.DIGITAL_OCEAN_ACCESS_SECRET,
            region_name=settings.DO_SPACES_REGION
        )
        self.bucket_name = settings.DO_SPACES_BUCKET
        self.cdn_url = settings.DO_SPACES_CDN_URL

    def generate_presigned_url(
        self, 
        file_name: str, 
        file_type: str,
        expires_in: int = 3600,
        folder: str = "uploads"
    ) -> dict:
        """Generate presigned URL for file upload."""
        try:
            # Generate unique file name
            file_extension = file_name.split('.')[-1] if '.' in file_name else ''
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            object_key = f"{folder}/{unique_filename}"
            
            # Generate presigned URL for PUT request
            presigned_url = self.spaces_client.generate_presigned_url(
                'put_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': object_key,
                    'ContentType': file_type
                },
                ExpiresIn=expires_in
            )
            
            # Generate public URL
            public_url = f"{self.cdn_url}/{object_key}"
            
            return {
                "upload_url": presigned_url,
                "file_url": public_url,
                "object_key": object_key,
                "expires_in": expires_in
            }
            
        except ClientError as e:
            raise Exception(f"Error generating presigned URL: {str(e)}")

    def generate_download_url(
        self, 
        object_key: str, 
        expires_in: int = 3600
    ) -> str:
        """Generate presigned URL for file download."""
        try:
            presigned_url = self.spaces_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': object_key
                },
                ExpiresIn=expires_in
            )
            return presigned_url
            
        except ClientError as e:
            raise Exception(f"Error generating download URL: {str(e)}")

    def delete_file(self, object_key: str) -> bool:
        """Delete file from Spaces."""
        try:
            self.spaces_client.delete_object(
                Bucket=self.bucket_name,
                Key=object_key
            )
            return True
            
        except ClientError as e:
            print(f"Error deleting file: {str(e)}")
            return False

    def get_file_info(self, object_key: str) -> Optional[dict]:
        """Get file information."""
        try:
            response = self.spaces_client.head_object(
                Bucket=self.bucket_name,
                Key=object_key
            )
            return {
                "size": response.get('ContentLength'),
                "last_modified": response.get('LastModified'),
                "content_type": response.get('ContentType'),
                "etag": response.get('ETag')
            }
            
        except ClientError as e:
            print(f"Error getting file info: {str(e)}")
            return None


# Initialize Spaces client
spaces_client = DigitalOceanSpaces()
