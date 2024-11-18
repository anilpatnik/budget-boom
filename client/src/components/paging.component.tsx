import { Pagination } from "@mui/material";
import { PAGE_SIZE } from "@/util/constants";

type ComponentProps = {
  count?: number;
  page?: number;
  size?: number;
  handlePaging?: (e: any, value: number) => void;
};
export const PagingComponent = ({
  count = 0,
  page = 0,
  size = PAGE_SIZE,
  handlePaging
}: ComponentProps) => {
  if (count > PAGE_SIZE) {
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
  }
  return null;
};
