import * as React from "react";

import { Stack, Text, Checkbox } from "@chakra-ui/react";

export type NestedCheckboxesProps = {
  parentValue: string;
  childValues: string[];
  withEffect?: (checkedItems: boolean[]) => void;
};

export const NestedCheckboxes = ({
  parentValue,
  childValues,
  withEffect,
}: NestedCheckboxesProps) => {
  const defaultChecked = childValues.map((value) => true);

  const [checkedItems, setCheckedItems] = React.useState(defaultChecked);

  const allChecked = checkedItems.every(Boolean);
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

  withEffect?.(checkedItems);

  return (
    <>
      <Checkbox
        isChecked={allChecked}
        isIndeterminate={isIndeterminate}
        onChange={(e) =>
          setCheckedItems((checkedItems) =>
            checkedItems.map(() => e.target.checked),
          )
        }
      >
        {parentValue}
      </Checkbox>

      <Stack pl={6} mt={1} spacing={1}>
        {childValues.map((item, index) => {
          const isChecked = checkedItems[index];
          return (
            <Checkbox
              key={item + index}
              isChecked={isChecked}
              onChange={(e) => {
                setCheckedItems((checkedItems) => {
                  const newCheckedItems = [...checkedItems];
                  newCheckedItems[index] = e.target.checked;
                  return newCheckedItems;
                });
              }}
            >
              <Text mt={4}>{item}</Text>
            </Checkbox>
          );
        })}
      </Stack>
    </>
  );
};
