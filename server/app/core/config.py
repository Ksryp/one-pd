from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PG_HOST: str = "localhost"
    PG_PORT: int = 5433
    PG_NAME: str = "snk_mes"
    PG_USER: str = "admincptd"
    PG_PASS: str = "CPTD1234"

    TSDB_HOST: str = "localhost"
    TSDB_PORT: int = 5432
    TSDB_NAME: str = "mqtt_data"
    TSDB_USER: str = "postgres"
    TSDB_PASS: str = "postgres"

    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:4173"

    @property
    def pg_dsn(self) -> str:
        return f"postgresql+psycopg2://{self.PG_USER}:{self.PG_PASS}@{self.PG_HOST}:{self.PG_PORT}/{self.PG_NAME}"

    @property
    def tsdb_dsn(self) -> str:
        return f"postgresql+psycopg2://{self.TSDB_USER}:{self.TSDB_PASS}@{self.TSDB_HOST}:{self.TSDB_PORT}/{self.TSDB_NAME}"

    @property
    def cors_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"


settings = Settings()
