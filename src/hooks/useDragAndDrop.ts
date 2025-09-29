import { useState, useCallback, useRef } from 'react';

export interface DragItem {
  id: string | number;
  type: string;
  data: any;
}

export interface DropZone {
  id: string;
  accepts: string[];
  onDrop: (item: DragItem, targetIndex?: number) => void;
}

export interface DragAndDropState {
  isDragging: boolean;
  draggedItem: DragItem | null;
  draggedOverZone: string | null;
  draggedOverIndex: number | null;
}

export interface DragAndDropActions {
  // Drag handlers
  handleDragStart: (item: DragItem) => void;
  handleDragEnd: () => void;
  
  // Drop zone handlers
  handleDragOver: (e: React.DragEvent, zoneId: string, index?: number) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, zone: DropZone, index?: number) => void;
  
  // Touch handlers for mobile
  handleTouchStart: (e: React.TouchEvent, item: DragItem) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
  
  // Utilities
  canDrop: (item: DragItem, zone: DropZone) => boolean;
  isValidDropTarget: (zoneId: string) => boolean;
  
  // State
  state: DragAndDropState;
  reset: () => void;
}

export const useDragAndDrop = (): DragAndDropActions => {
  const [state, setState] = useState<DragAndDropState>({
    isDragging: false,
    draggedItem: null,
    draggedOverZone: null,
    draggedOverIndex: null,
  });

  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const dragPreview = useRef<HTMLElement | null>(null);

  // Drag handlers
  const handleDragStart = useCallback((item: DragItem) => {
    setState(prev => ({
      ...prev,
      isDragging: true,
      draggedItem: item,
    }));
  }, []);

  const handleDragEnd = useCallback(() => {
    setState(prev => ({
      ...prev,
      isDragging: false,
      draggedItem: null,
      draggedOverZone: null,
      draggedOverIndex: null,
    }));
  }, []);

  // Drop zone handlers
  const handleDragOver = useCallback((e: React.DragEvent, zoneId: string, index?: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    setState(prev => ({
      ...prev,
      draggedOverZone: zoneId,
      draggedOverIndex: index ?? null,
    }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only clear if we're leaving the drop zone completely
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setState(prev => ({
        ...prev,
        draggedOverZone: null,
        draggedOverIndex: null,
      }));
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, zone: DropZone, index?: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (state.draggedItem && canDrop(state.draggedItem, zone)) {
      zone.onDrop(state.draggedItem, index);
    }
    
    handleDragEnd();
  }, [state.draggedItem]);

  // Touch handlers for mobile support
  const handleTouchStart = useCallback((e: React.TouchEvent, item: DragItem) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    
    setState(prev => ({
      ...prev,
      isDragging: true,
      draggedItem: item,
    }));
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!state.isDragging || !touchStartPos.current) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    
    // Create or update drag preview
    if (!dragPreview.current) {
      dragPreview.current = document.createElement('div');
      dragPreview.current.className = 'fixed z-50 pointer-events-none bg-white shadow-lg rounded-lg p-2 border-2 border-villa-mitre-500 opacity-80';
      dragPreview.current.textContent = state.draggedItem?.data?.name || 'Dragging...';
      document.body.appendChild(dragPreview.current);
    }
    
    dragPreview.current.style.left = `${touch.clientX - 50}px`;
    dragPreview.current.style.top = `${touch.clientY - 25}px`;
    
    // Find drop zone under touch
    const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elementUnder?.closest('[data-drop-zone]');
    
    if (dropZone) {
      const zoneId = dropZone.getAttribute('data-drop-zone');
      setState(prev => ({
        ...prev,
        draggedOverZone: zoneId,
      }));
    }
  }, [state.isDragging, state.draggedItem]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!state.isDragging) return;
    
    const touch = e.changedTouches[0];
    const elementUnder = document.elementFromPoint(touch.clientX, touch.clientY);
    const dropZone = elementUnder?.closest('[data-drop-zone]');
    
    if (dropZone && state.draggedItem) {
      const zoneId = dropZone.getAttribute('data-drop-zone');
      const onDropAttr = dropZone.getAttribute('data-on-drop');
      
      // Trigger drop if zone accepts the item type
      if (zoneId && onDropAttr) {
        try {
          const onDrop = new Function('item', 'index', onDropAttr);
          onDrop(state.draggedItem, null);
        } catch (error) {
          console.warn('Failed to execute drop handler:', error);
        }
      }
    }
    
    // Cleanup
    if (dragPreview.current) {
      document.body.removeChild(dragPreview.current);
      dragPreview.current = null;
    }
    
    touchStartPos.current = null;
    handleDragEnd();
  }, [state.isDragging, state.draggedItem]);

  // Utilities
  const canDrop = useCallback((item: DragItem, zone: DropZone): boolean => {
    return zone.accepts.includes(item.type);
  }, []);

  const isValidDropTarget = useCallback((zoneId: string): boolean => {
    return state.draggedOverZone === zoneId;
  }, [state.draggedOverZone]);

  const reset = useCallback(() => {
    setState({
      isDragging: false,
      draggedItem: null,
      draggedOverZone: null,
      draggedOverIndex: null,
    });
    
    if (dragPreview.current) {
      document.body.removeChild(dragPreview.current);
      dragPreview.current = null;
    }
  }, []);

  return {
    // Drag handlers
    handleDragStart,
    handleDragEnd,
    
    // Drop zone handlers
    handleDragOver,
    handleDragLeave,
    handleDrop,
    
    // Touch handlers
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    
    // Utilities
    canDrop,
    isValidDropTarget,
    
    // State
    state,
    reset,
  };
};

// Utility function to reorder array items
export const reorderArray = <T>(array: T[], fromIndex: number, toIndex: number): T[] => {
  const result = Array.from(array);
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
};

// Utility function to move item between arrays
export const moveItemBetweenArrays = <T>(
  sourceArray: T[],
  targetArray: T[],
  sourceIndex: number,
  targetIndex?: number
): { source: T[]; target: T[] } => {
  const newSource = Array.from(sourceArray);
  const newTarget = Array.from(targetArray);
  
  const [movedItem] = newSource.splice(sourceIndex, 1);
  
  if (targetIndex !== undefined) {
    newTarget.splice(targetIndex, 0, movedItem);
  } else {
    newTarget.push(movedItem);
  }
  
  return {
    source: newSource,
    target: newTarget,
  };
};

// Hook for sortable lists
export const useSortableList = <T extends { id: string | number }>(
  initialItems: T[],
  onReorder?: (items: T[]) => void
) => {
  const [items, setItems] = useState<T[]>(initialItems);
  const dragAndDrop = useDragAndDrop();

  const handleReorder = useCallback((fromIndex: number, toIndex: number) => {
    const newItems = reorderArray(items, fromIndex, toIndex);
    setItems(newItems);
    onReorder?.(newItems);
  }, [items, onReorder]);

  const moveItem = useCallback((itemId: string | number, newIndex: number) => {
    const currentIndex = items.findIndex(item => item.id === itemId);
    if (currentIndex !== -1 && currentIndex !== newIndex) {
      handleReorder(currentIndex, newIndex);
    }
  }, [items, handleReorder]);

  const addItem = useCallback((item: T, index?: number) => {
    setItems(prev => {
      const newItems = [...prev];
      if (index !== undefined) {
        newItems.splice(index, 0, item);
      } else {
        newItems.push(item);
      }
      onReorder?.(newItems);
      return newItems;
    });
  }, [onReorder]);

  const removeItem = useCallback((itemId: string | number) => {
    setItems(prev => {
      const newItems = prev.filter(item => item.id !== itemId);
      onReorder?.(newItems);
      return newItems;
    });
  }, [onReorder]);

  return {
    items,
    setItems,
    handleReorder,
    moveItem,
    addItem,
    removeItem,
    dragAndDrop,
  };
};
