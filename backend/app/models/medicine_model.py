from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base


class Medicine(Base):

    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    medicine_name = Column(String)

    dosage = Column(String)

    reminder_time = Column(String)

    taken_status = Column(Boolean, default=False)

    user = relationship("User")