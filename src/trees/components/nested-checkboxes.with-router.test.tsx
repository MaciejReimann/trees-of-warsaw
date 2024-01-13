import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { TestRouterWrapper } from "../../libs/tanstack-query/test-router-wrapper";
import { NestedCheckboxesWithRouter } from "./nested-checkboxes.with-router";

describe("NestedCheckboxesWithRouter", () => {
  describe("default state", () => {
    it("doesn't alter the router state", () => {
      // arrange
      const parentValue = "Parent Checkbox";
      const childValues = ["Child 1", "Child 2", "Child 3"];

      render(
        <TestRouterWrapper>
          <NestedCheckboxesWithRouter
            parentValue={parentValue}
            childValues={childValues}
          />
        </TestRouterWrapper>,
      );

      // act
      // No action needed for this test, as we are testing the default state

      // assert
      // Check that the URL has not changed (no navigation has occurred)
      expect(location.search).toBe("");
    });
  });
});
