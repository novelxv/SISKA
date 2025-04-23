"use client"

import type React from "react"
import "../styles/Modal.css"

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{title}</h3>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="button-white" onClick={onCancel}>
            Batal
          </button>
          <button className="button-blue" onClick={onConfirm}>
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
