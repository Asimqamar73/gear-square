import { Images } from "lucide-react";

//
const ProductMediaBox = ({ onMutate, image, newImage }: any) => {
  return (
    <div className="p-4 bg-white rounded-2xl flex flex-col gap-2 border  border-gray-300 shadow">
      <h2 className="text-xl mt-2">Product media</h2>
      <p className="text-sm text-gray-500">Product photo</p>
      <label
        htmlFor="product-image"
        className="p-1 flex flex-col items-center justify-center border-2 rounded-2xl border-dashed  border-gray-400 bg-gray-50 overflow-hidden cursor-pointer"
      >
        {/* {image ? (
          <img
            src={URL.createObjectURL(image)}
            className="w-full h-64 object-cover overflow-hidden rounded-2xl"
          />
        ) : (
          <>
            <Images size={72} strokeWidth={1} />
            <p className="text-green-700">Browser here</p>
          </>
        )} */}
        {newImage ? (
          <img
            src={URL.createObjectURL(newImage)}
            className="w-full h-64 object-cover overflow-hidden rounded-2xl"
          />
        ) : image ? (
          <img
            src={`file://${image}`}
            className="w-full h-64 object-cover overflow-hidden rounded-2xl"
          />
        ) : (
          <>
            <Images size={72} strokeWidth={1} />
            <p className="text-green-700">Browser here</p>
          </>
        )}
      </label>
      <input
        type="file"
        name="product-image"
        id="product-image"
        accept="image/*"
        className="hidden"
        onChange={onMutate}
      />
      {/* <img
                src="/Users/asimbinqamar/Library/Application Support/gear-square/images/1747899335804_aimal khan"
                alt="aasd"
              /> */}
    </div>
  );
};

export default ProductMediaBox;
