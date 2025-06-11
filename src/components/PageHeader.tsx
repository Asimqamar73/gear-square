interface IPageHeader{
    title:string;
    children?:any | undefined | null
}

const PageHeader = ({title, children }: IPageHeader) => {
  return (
      <div className="flex flex-col gap-2 ">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-3xl font-medium text-gray-700 mb-4">{title}</h1>
          {children}
        </div>
      </div>
  );
};

export default PageHeader;
