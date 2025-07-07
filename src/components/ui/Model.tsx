
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';


import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { useFocusTrap }      from '../../hooks/useFocusTrap';


import { XMarkIcon } from '@heroicons/react/24/outline';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  closeOnBackdropClick?: boolean;
  size?: ModalSize;
  hideCloseButton?: boolean;
  
  initialFocusRef?: React.RefObject<HTMLElement>;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  closeOnBackdropClick = true,
  size = 'md',
  hideCloseButton = false,
  initialFocusRef,
}) => {
  const modalRef    = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  
  useLockBodyScroll(isOpen);
  useFocusTrap(modalRef, isOpen, initialFocusRef);

  
  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  
  const handleBackdrop = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === backdropRef.current) onClose();
  };

  
  const sizeMap: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  if (!isOpen) return null;

  
  const dialog = (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
     
      <div className="fixed inset-0 bg-black/50" />

     
      <div
        ref={modalRef}
        className={classNames(
          'relative w-full overflow-hidden rounded-lg bg-white shadow-xl transition-all',
          sizeMap[size],
        )}
      >
        
        <header className="flex items-center justify-between border-b p-4">
          <h2 id="modal-title" className="text-xl font-semibold">
            {title}
          </h2>
          {!hideCloseButton && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="rounded-md p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          )}
        </header>

       
        <section className="max-h-[70vh] overflow-y-auto p-4">{children}</section>

        
        {actions && (
          <footer className="flex justify-end gap-3 border-t bg-gray-50 p-4">
            {actions}
          </footer>
        )}
      </div>
    </div>
  );

  return <>{createPortal(dialog, document.body)}</>;
};

Modal.displayName = 'Modal';
