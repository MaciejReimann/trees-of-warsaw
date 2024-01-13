import * as React from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";

import { NestedCheckboxes, NestedCheckboxesProps } from "./nested-checkboxes";

export const NestedCheckboxesWithRouter = ({
  parentValue,
  childValues,
}: NestedCheckboxesProps) => {
  return (
    <NestedCheckboxes
      parentValue={parentValue}
      childValues={childValues}
      withEffect={(checkedItems) => {
        const navigate = useNavigate();

        React.useEffect(() => {
          const speciesToFilterOut = childValues.filter(
            (_, index) => !checkedItems[index],
          );

          if (speciesToFilterOut.length > 0) {
            navigate({
              search: {
                filter: speciesToFilterOut,
              },
            });
          }
        }, [checkedItems, childValues]);
      }}
    />
  );
};
