import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { NestedCheckboxes } from "./nested-checkboxes";

describe("NestedCheckboxes", () => {
  describe("default state", () => {
    it("renders the parent checkbox checked", () => {
      // arrange
      const parentValue = "Parent Checkbox";
      const childValues = ["Child 1", "Child 2", "Child 3"];
      render(
        <NestedCheckboxes
          parentValue={parentValue}
          childValues={childValues}
        />,
      );

      // act
      // assert
      const parentCheckbox = screen.getByRole("checkbox", {
        name: parentValue,
      });
      expect(parentCheckbox).toBeChecked();
    });

    it("renders all the child checkboxes checked", () => {
      // arrange
      const parentValue = "Parent Checkbox";
      const childValues = ["Child 1", "Child 2", "Child 3"];
      render(
        <NestedCheckboxes
          parentValue={parentValue}
          childValues={childValues}
        />,
      );

      // act
      // assert
      childValues.forEach((childValue) => {
        const childCheckbox = screen.getByRole("checkbox", {
          name: childValue,
        });
        expect(childCheckbox).toBeChecked();
      });
    });
  });

  describe("when the parent is clicked", () => {
    it("unchecking the parent unchecks all the child checkboxes", () => {
      // arrange
      const parentValue = "Parent Checkbox";
      const childValues = ["Child 1", "Child 2", "Child 3"];
      render(
        <NestedCheckboxes
          parentValue={parentValue}
          childValues={childValues}
        />,
      );

      // act
      const parentCheckbox = screen.getByRole("checkbox", {
        name: parentValue,
      });
      fireEvent.click(parentCheckbox);

      // assert
      childValues.forEach((childValue) => {
        const childCheckbox = screen.getByRole("checkbox", {
          name: childValue,
        });
        expect(childCheckbox).not.toBeChecked();
      });
    });

    it("checking the parent checks all the child checkboxes", () => {
      // arrange
      const parentValue = "Parent Checkbox";
      const childValues = ["Child 1", "Child 2", "Child 3"];
      render(
        <NestedCheckboxes
          parentValue={parentValue}
          childValues={childValues}
        />,
      );

      // act
      const parentCheckbox = screen.getByRole("checkbox", {
        name: parentValue,
      });
      fireEvent.click(parentCheckbox);
      fireEvent.click(parentCheckbox);

      // assert
      childValues.forEach((childValue) => {
        const childCheckbox = screen.getByRole("checkbox", {
          name: childValue,
        });
        expect(childCheckbox).toBeChecked();
      });
    });
  });

  describe("when one of the children is unchecked", () => {
    it("does not uncheck the parent", () => {
      // arrange
      const parentValue = "Parent Checkbox";
      const childValues = ["Child 1", "Child 2", "Child 3"];
      render(
        <NestedCheckboxes
          parentValue={parentValue}
          childValues={childValues}
        />,
      );

      // act
      const childCheckbox = screen.getByRole("checkbox", {
        name: childValues[0],
      });
      fireEvent.click(childCheckbox);

      // assert
      const parentCheckbox = screen.getByRole("checkbox", {
        name: parentValue,
      });
      expect(parentCheckbox).not.toBeChecked();
    });

    describe("unless there is only one child", () => {
      it("unchecks the parent", () => {
        // arrange
        const parentValue = "Parent Checkbox";
        const childValues = ["Child 1"];
        render(
          <NestedCheckboxes
            parentValue={parentValue}
            childValues={childValues}
          />,
        );

        // act
        const childCheckbox = screen.getByRole("checkbox", {
          name: childValues[0],
        });
        fireEvent.click(childCheckbox);

        // assert
        const parentCheckbox = screen.getByRole("checkbox", {
          name: parentValue,
        });
        expect(parentCheckbox).not.toBeChecked();
      });
    });
  });

  describe("when all the children are unchecked", () => {
    it("unchecks the parent", () => {
      // arrange
      const parentValue = "Parent Checkbox";
      const childValues = ["Child 1", "Child 2", "Child 3"];
      render(
        <NestedCheckboxes
          parentValue={parentValue}
          childValues={childValues}
        />,
      );

      // act
      childValues.forEach((childValue) => {
        const childCheckbox = screen.getByRole("checkbox", {
          name: childValue,
        });
        fireEvent.click(childCheckbox);
      });

      // assert
      const parentCheckbox = screen.getByRole("checkbox", {
        name: parentValue,
      });
      expect(parentCheckbox).not.toBeChecked();
    });
  });
});
