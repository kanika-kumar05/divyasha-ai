from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.medicine_model import Medicine
from app.schemas.medicine_schema import MedicineCreate, MedicineUpdateStatus

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.post("/medicines")
def add_medicine(
    medicine: MedicineCreate,
    db: Session = Depends(get_db)
):

    new_medicine = Medicine(
        user_id=medicine.user_id,
        medicine_name=medicine.medicine_name,
        dosage=medicine.dosage,
        reminder_time=medicine.reminder_time,
        taken_status=False
    )

    db.add(new_medicine)
    db.commit()
    db.refresh(new_medicine)

    return {
        "message": "Medicine added successfully",
        "medicine": new_medicine
    }


@router.get("/medicines/{user_id}")
def get_medicines(
    user_id: int,
    db: Session = Depends(get_db)
):

    medicines = db.query(Medicine).filter(
        Medicine.user_id == user_id
    ).all()

    return medicines


@router.put("/medicines/{medicine_id}/status")
def update_medicine_status(
    medicine_id: int,
    status: MedicineUpdateStatus,
    db: Session = Depends(get_db)
):

    medicine = db.query(Medicine).filter(
        Medicine.id == medicine_id
    ).first()

    if not medicine:
        raise HTTPException(
            status_code=404,
            detail="Medicine not found"
        )

    medicine.taken_status = status.taken_status

    db.commit()
    db.refresh(medicine)

    return {
        "message": "Medicine status updated",
        "medicine": medicine
    }


@router.delete("/medicines/{medicine_id}")
def delete_medicine(
    medicine_id: int,
    db: Session = Depends(get_db)
):

    medicine = db.query(Medicine).filter(
        Medicine.id == medicine_id
    ).first()

    if not medicine:
        raise HTTPException(
            status_code=404,
            detail="Medicine not found"
        )

    db.delete(medicine)
    db.commit()

    return {
        "message": "Medicine deleted successfully"
    }