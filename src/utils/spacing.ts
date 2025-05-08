import { themeSpacing } from "@amsterdam/asc-ui";

const sizes = {
  xs: 5,
  sm: 10,
  md: 15,
  lg: 30,
  xl: 45,
  x2l: 60,
};

function getSpacing(size: keyof typeof sizes = "md") {
  return themeSpacing(sizes[size] / 4);
}

export { getSpacing };
