import { describe, it, expect } from "vitest";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";

import { NestedCheckboxes } from "./nested-checkboxes";

describe("NestedCheckboxes", () => {
  describe("default state", () => {
    it("renders the parent checkbox checked", async () => {
      // arrange
      const parentValue = "Parent Checkbox";
      const childValues = ["Child 1", "Child 2", "Child 3"];

      // act
      await act(async () =>
        render(
          <NestedCheckboxes
            parentValue={parentValue}
            childValues={childValues}
          />,
        ),
      );

      // assert
      await waitFor(() => {
        const parentCheckbox = screen.getByRole("checkbox", {
          name: parentValue,
        });

        expect(parentCheckbox).toBeChecked();
      });
    });

    it("renders all the child checkboxes checked", async () => {
      // arrange
      const parentValue = "Parent Checkbox";
      const childValues = ["Child 1", "Child 2", "Child 3"];

      // act
      await act(async () =>
        render(
          <NestedCheckboxes
            parentValue={parentValue}
            childValues={childValues}
          />,
        ),
      );

      // assert
      await waitFor(() => {
        childValues.forEach((childValue) => {
          const childCheckbox = screen.getByRole("checkbox", {
            name: childValue,
          });
          expect(childCheckbox).toBeChecked();
        });
      });
    });
  });

  describe("when the parent is clicked", () => {
    it("unchecking the parent unchecks all the child checkboxes", async () => {
      // arrange
      const parentValue = "Parent Checkbox";
      const childValues = ["Child 1", "Child 2", "Child 3"];

      // act
      await act(async () => {
        render(
          <NestedCheckboxes
            parentValue={parentValue}
            childValues={childValues}
          />,
        );
      });
      await act(async () => {
        const parentCheckbox = screen.getByRole("checkbox", {
          name: parentValue,
        });
        fireEvent.click(parentCheckbox);
      });

      // assert
      await waitFor(() => {
        childValues.forEach((childValue) => {
          const childCheckbox = screen.getByRole("checkbox", {
            name: childValue,
          });
          expect(childCheckbox).not.toBeChecked();
        });
      });
    });

    it("checking the parent checks all the child checkboxes", async () => {
      // arrange
      const parentValue = "Parent Checkbox";
      const childValues = ["Child 1", "Child 2", "Child 3"];

      // act
      await act(async () =>
        render(
          <NestedCheckboxes
            parentValue={parentValue}
            childValues={childValues}
          />,
        ),
      );
      await act(async () => {
        const parentCheckbox = screen.getByRole("checkbox", {
          name: parentValue,
        });
        // Uncheck and check again
        fireEvent.click(parentCheckbox);
        fireEvent.click(parentCheckbox);
      });

      // assert
      await waitFor(() => {
        childValues.forEach((childValue) => {
          const childCheckbox = screen.getByRole("checkbox", {
            name: childValue,
          });
          expect(childCheckbox).toBeChecked();
        });
      });
    });
  });

  describe("when one of the children is unchecked", () => {
    it("does not uncheck the parent", async () => {
      // arrange
      const parentValue = "Parent Checkbox";
      const childValues = ["Child 1", "Child 2", "Child 3"];

      // act
      await act(async () =>
        render(
          <NestedCheckboxes
            parentValue={parentValue}
            childValues={childValues}
          />,
        ),
      );
      await act(async () => {
        const childCheckbox = screen.getByRole("checkbox", {
          name: childValues[0],
        });
        fireEvent.click(childCheckbox);
      });

      // assert
      await waitFor(() => {
        const parentCheckbox = screen.getByRole("checkbox", {
          name: parentValue,
        });
        expect(parentCheckbox).not.toBeChecked();
      });
    });

    describe("unless there is only one child", () => {
      it("unchecks the parent", async () => {
        // arrange
        const parentValue = "Parent Checkbox";
        const childValues = ["Child 1"];

        // act
        await act(async () =>
          render(
            <NestedCheckboxes
              parentValue={parentValue}
              childValues={childValues}
            />,
          ),
        );
        await act(async () => {
          const childCheckbox = screen.getByRole("checkbox", {
            name: childValues[0],
          });
          fireEvent.click(childCheckbox);
        });

        // assert
        await waitFor(() => {
          const parentCheckbox = screen.getByRole("checkbox", {
            name: parentValue,
          });
          expect(parentCheckbox).not.toBeChecked();
        });
      });
    });
  });

  describe("when all the children are unchecked", () => {
    it("unchecks the parent", async () => {
      // arrange
      const parentValue = "Parent Checkbox";
      const childValues = ["Child 1", "Child 2", "Child 3"];

      // act
      await act(async () =>
        render(
          <NestedCheckboxes
            parentValue={parentValue}
            childValues={childValues}
          />,
        ),
      );
      await act(async () => {
        childValues.forEach((childValue) => {
          const childCheckbox = screen.getByRole("checkbox", {
            name: childValue,
          });
          fireEvent.click(childCheckbox);
        });
      });

      // assert
      await waitFor(() => {
        const parentCheckbox = screen.getByRole("checkbox", {
          name: parentValue,
        });
        expect(parentCheckbox).not.toBeChecked();
      });
    });
  });
});
