import React, { useEffect, useState } from "react";
import api from "@/utils/axios";
import S3Viewer from "@/components/preview/S3Viewer";
import Item from "./Item";
import { useAuth } from "@/utils/useAuth";
import { MENU_BAR_HEIGHT } from "@/components/MenuBar";

interface Warehouse {
    id: bigint;
    name: string;
    item_id: bigint;
    user_id: bigint;
    thumbnail: string;
    memo: string | null;
    total_size: number;
    filename: string;
    created_at: string | null;
    updated_at: string | null;
}

interface WarehousePanelProps {
    onModelSelect: (modelPath: string, itemId: bigint) => void;
    onClose: () => void;
}

const WarehousePanel: React.FC<WarehousePanelProps> = ({
    onModelSelect,
    onClose,
}) => {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [selectedWarehouse, setSelectedWarehouse] =
        useState<Warehouse | null>(null);
    const [showItem, setShowItem] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchWarehouses = async () => {
            if (!user) return;
            try {
                const response = await api.get<Warehouse[]>(
                    `/api/item/${user.id}`
                );
                setWarehouses(response.data);
                // デフォルトで最初のモデルを選択
                if (response.data.length > 0) {
                    setSelectedWarehouse(response.data[0]);
                }
            } catch (error) {}
        };

        fetchWarehouses();
    }, [user]);

    const handleThumbnailClick = (warehouse: Warehouse) => {
        setSelectedWarehouse(warehouse);
    };

    const handleAddToStudio = () => {
        if (selectedWarehouse) {
            const modelPath = `${import.meta.env.VITE_S3_URL}/warehouse/${
                selectedWarehouse.user_id
            }/${selectedWarehouse.id}/${selectedWarehouse.filename}`;
            onModelSelect(modelPath, selectedWarehouse.id);
            onClose();
        }
    };

    const handleNextClick = () => {
        setShowItem(true);
    };

    const handleBackClick = () => {
        if (showItem) {
            setShowItem(false);
        } else {
            onClose();
        }
    };

    return (
        <>
            <div className="fixed top-0 left-0 right-0 h-12 min-h-[48px] flex items-center px-4 border-b bg-white z-10">
                <button
                    onClick={handleBackClick}
                    className="text-2xl font-bold absolute left-4"
                >
                    &#x3C;
                </button>
                <h1 className="text-lg font-bold flex-1 text-center">STUDIO</h1>
                <div className="absolute right-4 w-[48px] text-center">
                    {showItem ? (
                        <button
                            onClick={handleAddToStudio}
                            disabled={!selectedWarehouse}
                            className="text-[#11529A] hover:opacity-80 text-sm disabled:opacity-50"
                        >
                            Display
                        </button>
                    ) : (
                        <button
                            onClick={handleNextClick}
                            disabled={!selectedWarehouse}
                            className="text-[#11529A] hover:opacity-80 text-sm disabled:opacity-50"
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
            <div className="pt-12 h-screen overflow-hidden">
                <div className="h-full overflow-y-auto">
                    {selectedWarehouse && (
                        <S3Viewer warehouse={selectedWarehouse} />
                    )}
                    {showItem ? (
                        <Item warehouse={selectedWarehouse} />
                    ) : (
                        <div
                            className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1 sm:gap-2 p-2 overflow-y-auto max-h-[calc(100vh-12rem)]"
                            style={{ marginBottom: `${MENU_BAR_HEIGHT}px` }}
                        >
                            {warehouses.map((warehouse) => (
                                <div
                                    key={warehouse.id}
                                    onClick={() =>
                                        handleThumbnailClick(warehouse)
                                    }
                                    className="bg-white shadow-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    <img
                                        src={`${
                                            import.meta.env.VITE_S3_URL
                                        }/warehouse/${warehouse.user_id}/${
                                            warehouse.id
                                        }/${warehouse.thumbnail}`}
                                        alt={warehouse.name}
                                        className="w-full aspect-square object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default WarehousePanel;
