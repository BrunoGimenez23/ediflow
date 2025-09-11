import { useBuildingsContext } from "../../contexts/BuildingContext";

const BuildingSelector = () => {
  const { buildings, selectedBuilding, setSelectedBuilding } = useBuildingsContext();

  if (buildings.length === 0) return null;

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">Seleccioná un edificio:</label>
      <select
        value={selectedBuilding?.id || ""}
        onChange={(e) => {
          const b = buildings.find(b => b.id === Number(e.target.value));
          setSelectedBuilding(b);
        }}
        className="border rounded p-2 w-full max-w-sm"
      >
        <option value="">-- Seleccioná --</option>
        {buildings.map(b => (
          <option key={b.id} value={b.id}>
            {b.name} — {b.address}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BuildingSelector;
