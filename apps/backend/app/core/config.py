from typing import List, Union

from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
    )

    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Audiobook API"
    VERSION: str = "0.1.0"

    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "audiobook_db"
    POSTGRES_PORT: str = "5434"

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    # CORS - Allow all origins for now
    BACKEND_CORS_ORIGINS: str = "*"

    @field_validator("BACKEND_CORS_ORIGINS", mode="after")
    @classmethod
    def assemble_cors_origins(cls, v: str) -> List[str]:
        if v == "*":
            return ["*"]
        if not v:
            return []
        return [i.strip() for i in v.split(",")]

    # Clerk Authentication
    CLERK_SECRET_KEY: str = ""

    # DigitalOcean Spaces
    DIGITAL_OCEAN_ACCESS_KEY: str = ""
    DIGITAL_OCEAN_ACCESS_SECRET: str = ""
    DO_SPACES_ENDPOINT: str = "https://nyc3.digitaloceanspaces.com"
    DO_SPACES_REGION: str = "nyc3"
    DO_SPACES_BUCKET: str = ""
    DO_SPACES_CDN_URL: str = ""


settings = Settings()
