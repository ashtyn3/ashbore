import { state, View, view, binding, Binding } from "ashbore";

class Hi extends View {
  @state
  title: string = "Counter";

  clicked() {
    this.title = "Clicked me";
    console.log("hi");
  }
  body() {
    return <b onClick={this.clicked}>{this.title}</b>;
  }
}

class Header extends View {
  @binding
  title: Binding<string>;

  @binding
  bob: Binding<string>;

  body() {
    return (
      <div>
        <h1>{this.title}</h1>
        <p>{this.bob}</p>
      </div>
    );
  }
}

@view
class App extends View {
  @state
  name: string = "ashtyn";

  @state
  count: any = { num: 0 };

  body() {
    return (
      <div>
        <Hi />
        <p>
          <em>{this.count.num}</em>
        </p>
        <Header title={this.count.num} bob={this.name} />

        <button
          onClick={() => {
            this.count = { num: this.count.num + 1 };
          }}
        >
          +
        </button>

        <button
          onClick={() => {
            this.count = { num: this.count.num - 1 };
          }}
        >
          -
        </button>
      </div>
    );
  }
}
