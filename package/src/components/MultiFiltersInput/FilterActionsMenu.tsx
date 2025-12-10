import {
  ActionIcon,
  Box,
  Group,
  Menu,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconAdjustmentsHorizontal,
  IconBookmark,
  IconBookmarkFilled,
  IconCheck,
  IconClock,
  IconCopy,
  IconDownload,
  IconHistory,
  IconStar,
  IconStarFilled,
  IconTrash,
} from "@tabler/icons-react";
import React from "react";

import type { ActiveFilter, FilterAction, FilterHistory, SavedFilterPreset } from "../../types/filter.types";
import { getOperatorLabel } from "../../utils";

export interface FilterActionsMenuProps {
  activeFilters: ActiveFilter[];
  onChange: (filters: ActiveFilter[]) => void;
  // Display preferences
  isCompactMode: boolean;
  setIsCompactMode: (value: boolean | ((prev: boolean) => boolean)) => void;
  showFilterCount: boolean;
  setShowFilterCount: (value: boolean | ((prev: boolean) => boolean)) => void;
  // Presets
  savedPresets?: SavedFilterPreset[];
  onSavePreset?: () => void;
  onLoadPreset?: (preset: SavedFilterPreset) => void;
  onTogglePresetFavorite?: (presetId: string) => void;
  onDeletePreset?: (presetId: string) => void;
  // History
  filterHistory?: FilterHistory[];
  // Custom actions
  customActions?: FilterAction[];
  // Feature flags
  disablePresets?: boolean;
  disableHistory?: boolean;
}

export const FilterActionsMenu: React.FC<FilterActionsMenuProps> = ({
  activeFilters,
  onChange,
  isCompactMode,
  setIsCompactMode,
  showFilterCount,
  setShowFilterCount,
  savedPresets = [],
  onSavePreset,
  onLoadPreset,
  onTogglePresetFavorite,
  onDeletePreset,
  filterHistory = [],
  customActions = [],
  disablePresets = false,
  disableHistory = false,
}) => {
  const copyFiltersToClipboard = () => {
    const filterText = activeFilters
      .map((f) => `${f.label} ${getOperatorLabel(f.operator)} ${f.displayValue}`)
      .join(", ");
    navigator.clipboard.writeText(filterText);
    notifications.show({
      title: "Copied to clipboard",
      message: "Filter configuration has been copied",
      color: "green",
      icon: <IconCopy size={16} />,
    });
  };

  const exportFiltersAsJSON = () => {
    const dataStr = JSON.stringify(activeFilters, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `filters-${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    notifications.show({
      title: "Exported successfully",
      message: "Filters have been exported as JSON",
      color: "green",
      icon: <IconDownload size={16} />,
    });
  };

  const hasQuickAccess = (!disablePresets && savedPresets.length > 0) || (!disableHistory && filterHistory.length > 0);

  return (
    <Menu position="bottom-end" shadow="lg" width={220} radius="md">
      <Menu.Target>
        <Tooltip label="Options" withArrow>
          <ActionIcon
            variant="light"
            m="4"
            onMouseDown={(event) => {
              // Prevent parent combobox from toggling when opening the menu
              event.stopPropagation();
            }}
          >
            <IconAdjustmentsHorizontal size={16} />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Display Options</Menu.Label>
        <Menu.Item
          leftSection={isCompactMode ? <IconCheck size={16} /> : <Box w={16} />}
          onClick={() => setIsCompactMode((prev) => !prev)}
        >
          Compact mode
        </Menu.Item>
        <Menu.Item
          leftSection={showFilterCount ? <IconCheck size={16} /> : <Box w={16} />}
          onClick={() => setShowFilterCount((prev) => !prev)}
        >
          Show filter count
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Actions</Menu.Label>
        {!disablePresets && (
          <Menu.Item
            leftSection={<IconBookmark size={16} />}
            onClick={onSavePreset}
            disabled={activeFilters.length === 0}
          >
            Save as preset
          </Menu.Item>
        )}
        <Menu.Item
          leftSection={<IconCopy size={16} />}
          onClick={copyFiltersToClipboard}
          disabled={activeFilters.length === 0}
        >
          Copy filters
        </Menu.Item>
        <Menu.Item
          leftSection={<IconDownload size={16} />}
          onClick={exportFiltersAsJSON}
          disabled={activeFilters.length === 0}
        >
          Export as JSON
        </Menu.Item>

        {/* Custom actions */}
        {customActions.length > 0 && (
          <>
            <Menu.Divider />
            <Menu.Label>Custom Actions</Menu.Label>
            {customActions.map((action) => (
              <Menu.Item
                key={action.id}
                leftSection={action.icon || <Box w={16} />}
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.label}
              </Menu.Item>
            ))}
          </>
        )}

        {hasQuickAccess && (
          <>
            <Menu.Divider />
            <Menu.Label>Quick Access</Menu.Label>
          </>
        )}

        {/* Saved Presets */}
        {!disablePresets && savedPresets.length > 0 && (
          <Menu
            trigger="hover"
            position="left-start"
            offset={4}
            closeOnClickOutside={false}
          >
            <Menu.Target>
              <Menu.Item leftSection={<IconBookmarkFilled size={16} />} rightSection="›">
                Saved Presets ({savedPresets.length})
              </Menu.Item>
            </Menu.Target>
            <Menu.Dropdown>
              <ScrollArea.Autosize mah={300}>
                {[...savedPresets]
                  .sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0))
                  .map((preset) => (
                    <Menu.Item
                      key={preset.id}
                      onClick={() => onLoadPreset?.(preset)}
                      leftSection={
                        preset.isFavorite ? (
                          <IconStarFilled size={14} color="gold" />
                        ) : (
                          <IconStar size={14} />
                        )
                      }
                      rightSection={
                        <Group gap={4}>
                          <ActionIcon
                            size="xs"
                            variant="subtle"
                            color="yellow"
                            onClick={(e) => {
                              e.stopPropagation();
                              onTogglePresetFavorite?.(preset.id);
                            }}
                          >
                            {preset.isFavorite ? (
                              <IconStarFilled size={12} />
                            ) : (
                              <IconStar size={12} />
                            )}
                          </ActionIcon>
                          <ActionIcon
                            size="xs"
                            variant="subtle"
                            color="red"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeletePreset?.(preset.id);
                            }}
                          >
                            <IconTrash size={12} />
                          </ActionIcon>
                        </Group>
                      }
                    >
                      <Stack gap={2}>
                        <Text size="sm" fw={500}>
                          {preset.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {preset.filters.length} filter
                          {preset.filters.length !== 1 ? "s" : ""}
                        </Text>
                      </Stack>
                    </Menu.Item>
                  ))}
              </ScrollArea.Autosize>
            </Menu.Dropdown>
          </Menu>
        )}

        {/* Filter History */}
        {!disableHistory && filterHistory.length > 0 && (
          <Menu trigger="hover" position="left-start" offset={4}>
            <Menu.Target>
              <Menu.Item leftSection={<IconHistory size={16} />} rightSection="›">
                Recent Filters
              </Menu.Item>
            </Menu.Target>
            <Menu.Dropdown>
              <ScrollArea.Autosize mah={250}>
                {filterHistory.slice(0, 5).map((history, idx) => (
                  <Menu.Item
                    key={idx}
                    onClick={() => onChange(history.filters)}
                    leftSection={<IconClock size={14} />}
                  >
                    <Stack gap={2}>
                      <Text size="sm">
                        {history.filters.length} filter
                        {history.filters.length !== 1 ? "s" : ""}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {new Date(history.timestamp).toLocaleString()}
                      </Text>
                    </Stack>
                  </Menu.Item>
                ))}
              </ScrollArea.Autosize>
            </Menu.Dropdown>
          </Menu>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

export default FilterActionsMenu;

