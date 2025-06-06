import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import axios from 'axios';

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment, updateAppointments } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)
  const [prescription, setPrescription] = useState('')
  const [showPrescriptionInput, setShowPrescriptionInput] = useState({})



  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken,updateAppointments])

  const handlePrescription = async (appointment, prescription, index) => {
    try {
      const res = await axios.post('/doctor/prescription', {
        appointmentId: appointment._id,
        prescription
      });
      getAppointments()
      if(res.data){
        setPrescription('');
        setShowPrescriptionInput((prev) => ({ ...prev, [index]: false }));
      }
    } catch (error) {
      console.log('Error adding prescription:', error);
    }
  };

  return (
    <div className='w-full max-w-6xl m-5'>

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
  {/* Header */}
  <div className='max-sm:hidden grid grid-cols-8 gap-1 py-3 px-6 border-b'>
    <p>#</p>
    <p>Patient</p>
    <p>Payment</p>
    <p>Age</p>
    <p>Date & Time</p>
    <p>Fees</p>
    <p>Video Call</p>
    <p>Action</p>
  </div>

  {/* Appointments List */}
  {appointments.map((item, index) => (

      <div
      key={index}
        className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-8 gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
      >
      {/* 1. Index */}
      <p className='max-sm:hidden'>{index + 1}</p>

      {/* 2. Patient */}
      <div className='flex items-center gap-2'>
        <img src={item.userData.image} className='w-8 h-8 rounded-full object-cover' alt="Patient" />
        <p>{item.userData.name}</p>
      </div>

      {/* 3. Payment */}
      <div>
        <p className='text-xs inline border border-primary px-2 py-0.5 rounded-full'>
          {item.payment ? 'Online' : 'CASH'}
        </p>
      </div>

      {/* 4. Age */}
      <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>

      {/* 5. Date & Time */}
      <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

      {/* 6. Fees */}
      <p>{currency}{item.amount}</p>

      {/* 7. Video Call Button */}
      <Link
        to={`/video-call/${item.userId}`}
        className='text-primary hover:underline text-sm'
        >
        Video Call</Link>

      {/* 8. Action Buttons */}
      {item.cancelled ? (
        <p className='text-red-400 text-xs font-medium'>Cancelled</p>
      ) : item.isCompleted ? (
        
        item.prescription ? (
          <p>{item.prescription}</p>
        ) : (
          <>
        <button
                onClick={() => setShowPrescriptionInput((prev) => ({ ...prev, [index]: !prev[index] }))}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
                >
                  Add Prescription
                </button>
            {showPrescriptionInput[index] && (
              <div className='flex flex-col gap-2'>
                <textarea
                  placeholder='Write prescription'
                  className='border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-blue-300'
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                />
                <button
                  onClick={() => handlePrescription(item, prescription, index)}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"
                >
                  Save
                </button>
              </div>
            )}
          </>

        )

      ) : (


        <p className='text-green-500 text-xs font-medium'>Completed</p>
     
      ) || (

        <div className='flex gap-2'>
          <img onClick={() => cancelAppointment(item._id)} className='w-6 cursor-pointer' src={assets.cancel_icon} alt="Cancel" />
        
           
              <img onClick={() => completeAppointment(item._id)} className='w-6 cursor-pointer' src={assets.tick_icon} alt="Complete" />
           
        
        </div>
      )}
      </div>
     
  ))}
</div>

    </div>
  )
}
export default DoctorAppointments