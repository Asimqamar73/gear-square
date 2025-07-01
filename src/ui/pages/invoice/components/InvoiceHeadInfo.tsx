const InvoiceHeadInfo = ({ vehicleDetails, handleVehicleDetailsChange }: any) => {
  return (
    <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border  border-gray-300 shadow">
      <h2 className="text-xl mt-2">Vehicle information</h2>
      <div className="flex gap-4">
        <div className="flex flex-col gap-1 grow">
          <label htmlFor="vehicleNumber" className="text-sm text-gray-500">
            Vehicle number
          </label>
          <input
            type="text"
            name="vehicleNumber"
            id="vehicleNumber"
            className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
            //   onChange={onMutate}
            //   value={product.name}
            required
            value={vehicleDetails.vehicle_number}
            placeholder="LXI-990"
            onChange={handleVehicleDetailsChange}
          />
        </div>
        <div className="flex flex-col gap-1 grow">
          <label htmlFor="make" className="text-sm text-gray-500">
            Make
          </label>
          <input
            type="text"
            name="make"
            id="make"
            className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
            //   onChange={onMutate}
            //   value={product.name}
            required
            value={vehicleDetails.make}
            placeholder="Honda"
            onChange={handleVehicleDetailsChange}
          />
        </div>{" "}
        <div className="flex flex-col gap-1 grow">
          <label htmlFor="name" className="text-sm text-gray-500">
            Model
          </label>
          <input
            type="text"
            name="model"
            id="model"
            className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
            //   onChange={onMutate}
            //   value={product.name}
            required
            value={vehicleDetails.model}
            placeholder="Accord"
            onChange={handleVehicleDetailsChange}
          />
        </div>
            <div className="flex flex-col gap-1 grow">
          <label htmlFor="chassisNumber" className="text-sm text-gray-500">
            Chassis number
          </label>
          <input
            type="text"
            name="chassisNumber"
            id="chassisNumber"
            className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
            //   onChange={onMutate}
            //   value={product.name}
            required
            value={vehicleDetails.chassis_number}
            placeholder="5UXXW3C53J0"
            onChange={handleVehicleDetailsChange}
          />
        </div>
         <div className="flex flex-col gap-1 grow">
          <label htmlFor="year" className="text-sm text-gray-500">
            Year
          </label>
          <input
            type="text"
            name="year"
            id="year"
            className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
            //   onChange={onMutate}
            //   value={product.name}
            required
            value={vehicleDetails.year}
            placeholder="2023"
            onChange={handleVehicleDetailsChange}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 grow">
        <label htmlFor="name" className="text-sm text-gray-500">
          Note
        </label>
        <textarea
          name="note"
          id="note"
          className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
          //   onChange={onMutate}
          //   value={product.name}
          required
          value={vehicleDetails.note}
          onChange={handleVehicleDetailsChange}
          placeholder="About services"
          rows={4}
        ></textarea>
      </div>
    </div>
  );
};

export default InvoiceHeadInfo;
