// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .invoke_handler(tauri::generate_handler![
            commands::get_portfolios,
            commands::save_portfolio,
            commands::delete_portfolio,
            commands::export_markdown,
            commands::get_app_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
