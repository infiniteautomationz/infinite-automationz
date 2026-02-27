export type CommandResultDTO = {
  id: string;
  label: string;
  subtitle?: string;
  href?: string;
  kind: 'route' | 'work_item' | 'message_thread' | 'file' | 'workspace';
};

export type QuickActionDTO = {
  action: 'create_support_ticket' | 'create_calendar_event' | 'create_thread';
  payload?: Record<string, string>;
};

export type WorkflowHintDTO = {
  id: string;
  title: string;
  description: string;
  action: QuickActionDTO;
  tone?: 'gold' | 'danger' | 'warning' | 'info' | 'success' | 'neutral';
};
