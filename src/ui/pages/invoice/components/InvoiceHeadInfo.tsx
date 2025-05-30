const InvoiceHeadInfo = ({ servive, handleServiceDetailsChange }: any) => {
  return (
    <div className="p-4 bg-white rounded-2xl flex flex-col gap-4 border  border-gray-300 shadow">
      <h2 className="text-xl mt-2">General information</h2>
      <div className="flex gap-4">
        <div className="flex flex-col gap-1 grow">
          <label htmlFor="name" className="text-sm text-gray-500">
            Owner name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
            //   onChange={onMutate}
            //   value={product.name}
            required
            value={servive.name}
            placeholder="e.g: John Doe"
            onChange={handleServiceDetailsChange}
          />
        </div>{" "}
        <div className="flex flex-col gap-1 grow">
          <label htmlFor="name" className="text-sm text-gray-500">
            Phone number
          </label>
          <input
            type="text"
            name="phone_number"
            id="phone_number"
            className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
            //   onChange={onMutate}
            //   value={product.name}
            required
            value={servive.phone_number}
            placeholder="+97150564590811"
            onChange={handleServiceDetailsChange}
          />
        </div>
        <div className="flex flex-col gap-1 grow">
          <label htmlFor="name" className="text-sm text-gray-500">
            Vehicle number
          </label>
          <input
            type="text"
            name="vehicle_number"
            id="vehicle_number"
            className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
            //   onChange={onMutate}
            //   value={product.name}
            required
            value={servive.vehicle_number}
            placeholder="LXI-990"
            onChange={handleServiceDetailsChange}
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
          value={servive.note}
          onChange={handleServiceDetailsChange}
          placeholder="About services"
          rows={4}
        >
        </textarea>
      </div>
    </div>
  );
};

export default InvoiceHeadInfo;
