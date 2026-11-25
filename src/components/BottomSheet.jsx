
import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import "./BottomSheet.css";

function BottomSheet({ onClose, children, title = "Select cover" }) {
  const [height, setHeight] = useState(95);
  const [dragging, setDragging] = useState(false);

  const startY = useRef(0);
  const startHeight = useRef(95);
  const currentHeight = useRef(95);
  const contentRef = useRef(null);
  const pointerId = useRef(null);

  // Prevent background scrolling
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Update sheet height
  const updateHeight = (value) => {
    const next = Math.max(45, Math.min(95, value));

    currentHeight.current = next;
    setHeight(next);
  };

  // Start dragging
  const handlePointerDown = (e) => {
    if (e.target.closest("button")) return;
    if (e.button !== undefined && e.button !== 0) return;

    startY.current = e.clientY;
    startHeight.current = currentHeight.current;
    pointerId.current = e.pointerId;

    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  // Drag sheet
  const handlePointerMove = (e) => {
    if (pointerId.current !== e.pointerId) return;

    const delta = startY.current - e.clientY;
    const viewportHeight = window.innerHeight;

    updateHeight(
      startHeight.current + (delta / viewportHeight) * 100
    );
  };

  // End dragging
  const handlePointerUp = (e) => {
    if (pointerId.current !== e.pointerId) return;

    pointerId.current = null;
    setDragging(false);

    const current = currentHeight.current;

    if (current < 67) {
      updateHeight(45);
    } else {
      updateHeight(95);
    }
  };

  // Desktop scroll gestures
  const handleWheel = (e) => {
    if (e.deltaY < -20) {
      updateHeight(95);
    } else if (
      e.deltaY > 20 &&
      contentRef.current?.scrollTop === 0
    ) {
      updateHeight(45);
    }
  };

  // Close only through X button
  const handleClose = (e) => {
    e.stopPropagation();
    onClose?.();
  };

  return (
    <div className="sheet-overlay">
      <div
        className={`bottom-sheet ${dragging ? "is-dragging" : ""}`}
        style={{ height: `${height}dvh` }}
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
      >
        {/* Drag Handle */}
        <div
          className="sheet-drag-area"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="sheet-handle" />
        </div>

        {/* Header */}
        <div
          className="sheet-header"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <h3>{title}</h3>

          <button
            type="button"
            className="sheet-close"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onClick={handleClose}
            aria-label="Close bottom sheet"
          >
            <X size={23} />
          </button>
        </div>

        {/* Content */}
        <div className="sheet-content" ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default BottomSheet;
