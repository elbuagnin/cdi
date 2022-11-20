export let CDIOptions = { tagType: "compromise", name: "" };

export function setCDIOptions() {
  const optionList = arguments[0][0];

  if (typeof optionList === "string") {
    let args = optionList.split(" ");
    args = args.map((arg) => {
      return arg.trim();
    });

    const options = Object.values(args).map((arg) => {
      if (arg.includes("=")) {
        return arg.substring(0, arg.indexOf("="));
      } else {
        return arg;
      }
    });

    const settings = Object.values(args).map((arg) => {
      if (arg.includes("=")) {
        return arg.substring(arg.indexOf("=") + 1);
      } else {
        return true;
      }
    });

    options.forEach((option, key) => {
      switch (option) {
        case "tagType":
          CDIOptions.tagType = settings[key];
          break;
        case "name":
          CDIOptions.name = settings[key];
          break;
        default:
          break;
      }
    });
  } else {
    return false;
  }
}
