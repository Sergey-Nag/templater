import { DataModule } from "../module/Data.module";
import { DomModule } from "../module/Dom.module";
import { TrackedData, ValueData } from "../types/data/Data.type";
import { Config } from "../types/templater/Config.type";

export class Templater {
  public el: string;
  // $event: EventEmitterModule;
  private $data: DataModule;
  private $dom: DomModule;
  data: TrackedData;

  constructor({ el, data }: Config) {
    this.el = el;
    
    this.$data = new DataModule();
    this.$dom = new DomModule(el, this.getData.bind(this));
    this.data = this.$data.initData(data, this.$dom.updateNodes.bind(this.$dom));
  }

  getData(key?: string): TrackedData {
    return key ? this.$data.getTrackedData(key) as any : this.$data.getTrackedData();
  }
  
  run() {
    this.$dom.run();
    this.$data.run();
  }
}