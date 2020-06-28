export abstract class Incoming<T> {
  protected packet: T;

  setPacket(packet: T) {
    this.packet = packet;
    return this;
  }

  public abstract process(): void;
}
