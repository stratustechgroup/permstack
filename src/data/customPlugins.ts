import type { Plugin, PermissionNode } from './types';

const STORAGE_KEY = 'permstack_custom_plugins';
const PERMISSIONS_STORAGE_KEY = 'permstack_custom_permissions';

export interface CustomPluginData {
  plugin: Plugin;
  permissions: PermissionNode[];
  addedAt: string;
  source: 'local' | 'web' | 'ai';
}

// Load custom plugins from localStorage
export function loadCustomPlugins(): CustomPluginData[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load custom plugins:', error);
  }
  return [];
}

// Save a custom plugin to localStorage
export function saveCustomPlugin(data: CustomPluginData): void {
  try {
    const existing = loadCustomPlugins();
    // Check if plugin already exists
    const existingIndex = existing.findIndex(p => p.plugin.id === data.plugin.id);
    if (existingIndex >= 0) {
      // Update existing
      existing[existingIndex] = data;
    } else {
      // Add new
      existing.push(data);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.warn('Failed to save custom plugin:', error);
  }
}

// Remove a custom plugin from localStorage
export function removeCustomPlugin(pluginId: string): void {
  try {
    const existing = loadCustomPlugins();
    const filtered = existing.filter(p => p.plugin.id !== pluginId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.warn('Failed to remove custom plugin:', error);
  }
}

// Get all custom plugins as Plugin[]
export function getCustomPlugins(): Plugin[] {
  return loadCustomPlugins().map(d => d.plugin);
}

// Get permissions for a custom plugin
export function getCustomPluginPermissions(pluginId: string): PermissionNode[] {
  const data = loadCustomPlugins().find(d => d.plugin.id === pluginId);
  return data?.permissions || [];
}

// Check if a plugin is custom
export function isCustomPlugin(pluginId: string): boolean {
  return loadCustomPlugins().some(d => d.plugin.id === pluginId);
}

// Get all custom permissions merged
export function getAllCustomPermissions(): PermissionNode[] {
  return loadCustomPlugins().flatMap(d => d.permissions);
}

// Clear all custom plugins
export function clearCustomPlugins(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(PERMISSIONS_STORAGE_KEY);
}
