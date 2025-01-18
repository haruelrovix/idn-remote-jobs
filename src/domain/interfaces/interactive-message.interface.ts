export interface RowDto {
  id: string;
  title: string;
  description?: string;
}

export interface SectionDto {
  title?: string;
  rows: RowDto[];
}

export interface ActionDto {
  sections: SectionDto[];
  button: string;
}

export interface HeaderDto {
  type: string;
  text: string;
}

export interface BodyDto {
  text: string;
}

export interface FooterDto {
  text: string;
}

export interface ListMessageDto {
  to: string;
  type: string;
  body: BodyDto;
  action: ActionDto;
  header?: HeaderDto;
  footer?: FooterDto;
}

export interface InteractiveMessageData {
  message: ListMessageDto;
}
