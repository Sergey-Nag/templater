import { DataModule } from "../modules/Data.module";
import { DomModule } from "../modules/Dom.module";
import { Config } from "../types/templater/Config.type";
export class Templater {
  public el: string;
  private isFirstRun: true;
  // $event: EventEmitterModule;
  private $data: DataModule;
  private $dom: DomModule;
  data: object;

  constructor({ el, data }: Config) {
    this.el = el;
    
    this.$data = new DataModule();
    this.$dom = new DomModule(el);

    // this.data = this.$data.initData(data, this.$dom.updateNodes);
    this.data = this.$data.initData(data, this.$dom.updateNodes.bind(this.$dom));
    // this.element = this.getElement(el);
    // this.$event = EventEmitterModule.getInstance();
    this.$dom.run();
    this.$data.run();
  }

  run() {

    // this.parseDown();
    // this.updateNodeValue();
    // console.log(this.getData());
    // console.log(this.getNodes());
  }
}