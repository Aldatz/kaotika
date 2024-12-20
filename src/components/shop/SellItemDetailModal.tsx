import React from 'react';
import ItemStats from './ItemStats';
import ItemBaseStats from './ItemBaseStats';

// Definición de tipos para las props
interface Item {
  name?: string;
  description?: string;
  value: number;
  image?: string;
  type?: string;
}

interface Player {
  gold: number;
}

interface SellItemDetailModalProps {
  selectedItem: Item | null; // El ítem puede ser null
  currentAttributes: any; // Ajusta si tienes un tipo específico
  player: Player | any; // El jugador puede ser null
  closeModal: () => void; // Función sin argumentos que cierra el modal
  initiateSell: (item: Item | any) => void; // Función que recibe un Item y no devuelve nada
}

const SellItemDetailModal = ({
  selectedItem,
  currentAttributes,
  player,
  closeModal,
  initiateSell,
}: SellItemDetailModalProps) => {
  // Función para iniciar la venta y cerrar el modal
  const handleSellClick = () => {
    if (selectedItem) {
      initiateSell(selectedItem); // Inicia la venta
      closeModal(); // Cierra el modal después de la venta
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="w-4/5 max-w-6xl p-8 rounded-xl shadow-lg relative border-2 border-sepia bg-black bg-opacity-70">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-white text-xl font-bold bg-sepia bg-opacity-70 rounded-full px-3 py-1 hover:bg-opacity-90 border-2 border-sepia"
        >
          X
        </button>
        <div className="flex flex-row gap-6">
          {/* Si el objeto es un ingrediente */}
          {selectedItem?.type === 'ingredient' ? (
            <>
              {/* Imagen del ítem */}
              <div className="w-1/3 flex items-center justify-center rounded-lg p-4">
                <img
                  src={selectedItem?.image}
                  alt={selectedItem?.name || 'Selected Item'}
                  className="w-full h-full max-h-96 object-contain rounded-lg shadow-md border-2 border-sepia"
                />
              </div>
              {/* Nombre, descripción y botón de venta */}
              <div className="w-2/3 flex flex-col justify-center items-center text-center">
                <p className="text-white text-5xl font-bold mb-4">
                  {selectedItem?.name || 'Unnamed Item'}
                </p>
                <p className="text-white text-3xl mb-6">
                  {selectedItem?.description || 'No description available.'}
                </p>
                <button
                  onClick={handleSellClick} // Usamos la nueva función aquí
                  className="bg-black bg-opacity-70 text-white text-3xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2"
                >
                  Sell for {Math.floor(selectedItem.value / 3)}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Estadísticas del ítem */}
              {selectedItem && player && (
                <div className="w-1/3 flex items-center justify-center rounded-xl p-4">
                  <ItemStats
                    selectedItem={selectedItem}
                    player={player}
                  />
                </div>
              )}
              {/* Imagen del ítem */}
              <div className="w-1/3 flex items-center justify-center rounded-lg p-4">
                <img
                  src={selectedItem?.image}
                  alt={selectedItem?.name || 'Selected Item'}
                  className="w-full h-full max-h-96 object-contain rounded-lg shadow-md border-2 border-sepia"
                />
              </div>
              {/* Descripción y acciones */}
              <div className="w-1/3 flex flex-col justify-center items-center text-center">
                <p className="text-white text-3xl mb-6 p-2">
                  {selectedItem?.description || 'Select an item to view stats.'}
                </p>
                {selectedItem ? (
                  <ItemBaseStats selectedItem={selectedItem} player={player} />
                ) : (
                  <div className="text-center text-4xl text-white italic">
                    Select an item to view stats.
                  </div>
                )}
                <div className="flex space-x-4 mt-auto p-2">
                  {selectedItem && (
                    <button
                      onClick={handleSellClick} // Usamos la nueva función aquí
                      className="bg-black bg-opacity-70 text-white text-3xl font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-neutral-800 hover:bg-opacity-70 border-sepia border-2"
                    >
                      Sell for {Math.floor(selectedItem.value / 3)}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellItemDetailModal;
