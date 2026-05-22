from pydantic import BaseModel


class MedicineCreate(BaseModel):

    user_id: int

    medicine_name: str

    dosage: str

    reminder_time: str


class MedicineUpdateStatus(BaseModel):

    taken_status: bool