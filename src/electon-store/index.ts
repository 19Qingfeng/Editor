import Store from "electron-store";

interface storeProps {
  name: string;
}

class EStore extends Store {
  constructor(props: storeProps) {
    super(props);
  }
}

const store: EStore = new EStore({
  name: "cys",
});

store.set("cys", ["cys-why"]);

export { store };
