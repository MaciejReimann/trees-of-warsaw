import { describe, it, expect } from "vitest";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";

import { TestRouterWrapper } from "../../libs/tanstack-query/test-router-wrapper";
import { NestedCheckboxesWithRouter } from "./nested-checkboxes.with-router";

describe("NestedCheckboxesWithRouter", () => {
  describe("default state", () => {
    it("doesn't alter the router state", async () => {
      // arrange
      const parentValue = "Parent Checkbox";
      const childValues = ["Child 1", "Child 2", "Child 3"];

      // act
      await act(async () =>
        render(
          <TestRouterWrapper>
            <NestedCheckboxesWithRouter
              parentValue={parentValue}
              childValues={childValues}
            />
          </TestRouterWrapper>,
        ),
      );

      // assert
      await waitFor(() => {
        expect(location.search).toBe("");
      });
    });

    describe("when the parent checkbox is unchecked", () => {
      it("modifies the URL search params", async () => {
        // arrange
        const parentValue = "Parent Checkbox";
        const childValues = ["Child 1", "Child 2", "Child 3"];

        // act
        await act(async () =>
          render(
            <TestRouterWrapper>
              <NestedCheckboxesWithRouter
                parentValue={parentValue}
                childValues={childValues}
              />
            </TestRouterWrapper>,
          ),
        );

        // Click the parent checkbox to uncheck it
        await act(async () => {
          const parentCheckbox = screen.getByRole("checkbox", {
            name: parentValue,
          });
          fireEvent.click(parentCheckbox);
        });

        // assert
        await waitFor(() => {
          expect(location.search).toBe(
            "?filter=%5B%22Child%201%22%2C%22Child%202%22%2C%22Child%203%22%5D",
          );

          const searchParams = new URLSearchParams(location.search);
          expect(searchParams.get("filter")).toBe(
            '["Child 1","Child 2","Child 3"]',
          );
        });
      });
    });
  });
});
