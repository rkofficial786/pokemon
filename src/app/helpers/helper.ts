export const formatId = (id: number) => {
    return String(id).padStart(3, "0");
  };
  
  export const formatName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };