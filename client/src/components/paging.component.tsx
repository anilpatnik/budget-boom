import { Pagination } from "@mui/material";

type ComponentProps = {
  count?: number;
  page?: number;
  size?: number;
  handlePaging?: (e: any, value: number) => void;
};
export const PagingComponent = ({
  count = 0,
  page = 0,
  size = 10,
  handlePaging
}: ComponentProps) => {
  return (
    <Pagination
      className="ion-float-right"
      count={Math.ceil(count / size)}
      page={page + 1}
      variant="outlined"
      shape="rounded"
      onChange={handlePaging}
    />
  );
};
