use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Portfolio {
    pub id: String,
    pub number: i32,
    pub name: String,
    pub category: Category,
    pub platform: String,
    pub description: String,
    pub design_theme: DesignTheme,
    pub features: Vec<String>,
    pub tech_stack: std::collections::HashMap<String, String>,
    pub screens: Vec<String>,
    pub usage_steps: Vec<String>,
    pub version: String,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Category {
    pub id: String,
    pub name: String,
    pub icon: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DesignTheme {
    pub name: String,
    pub bg: String,
    pub text: String,
    pub accent: String,
    pub border: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PortfolioData {
    pub portfolios: Vec<Portfolio>,
    pub next_number: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ExportData {
    pub portfolio: Portfolio,
    pub content: String,
}

#[derive(Debug, Serialize)]
pub struct ExportResult {
    pub success: bool,
    pub path: Option<String>,
}

fn get_data_path() -> Result<PathBuf, String> {
    dirs::home_dir()
        .map(|home| home.join(".portfolio-generator").join("portfolios.json"))
        .ok_or_else(|| "Failed to get home directory".to_string())
}

fn load_data() -> Result<PortfolioData, String> {
    let data_path = get_data_path()?;

    if data_path.exists() {
        fs::read_to_string(&data_path)
            .map_err(|e| format!("Failed to read data: {}", e))
            .and_then(|content| {
                serde_json::from_str(&content)
                    .map_err(|e| format!("Failed to parse data: {}", e))
            })
    } else {
        Ok(PortfolioData {
            portfolios: Vec::new(),
            next_number: 1,
        })
    }
}

fn save_data(data: &PortfolioData) -> Result<(), String> {
    let data_path = get_data_path()?;

    // Create directory if it doesn't exist
    if let Some(parent) = data_path.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create directory: {}", e))?;
    }

    let json = serde_json::to_string_pretty(data)
        .map_err(|e| format!("Failed to serialize data: {}", e))?;

    fs::write(&data_path, json)
        .map_err(|e| format!("Failed to write data: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn get_portfolios() -> Result<PortfolioData, String> {
    load_data()
}

#[tauri::command]
pub fn save_portfolio(portfolio: Portfolio) -> Result<PortfolioData, String> {
    let mut data = load_data()?;

    let existing_index = data.portfolios.iter().position(|p| p.id == portfolio.id);
    let portfolio_number = portfolio.number;

    if let Some(index) = existing_index {
        data.portfolios[index] = portfolio;
    } else {
        data.portfolios.insert(0, portfolio);
        data.next_number = data.next_number.max(portfolio_number + 1);
    }

    save_data(&data)?;
    Ok(data)
}

#[tauri::command]
pub fn delete_portfolio(id: String) -> Result<PortfolioData, String> {
    let mut data = load_data()?;
    data.portfolios.retain(|p| p.id != id);
    save_data(&data)?;
    Ok(data)
}

#[tauri::command]
pub fn export_markdown(data: ExportData) -> Result<ExportResult, String> {
    let downloads_dir = dirs::download_dir()
        .ok_or_else(|| "Failed to get downloads directory".to_string())?;

    let filename = format!("{}.md", data.portfolio.name.replace(' ', "_"));
    let file_path = downloads_dir.join(&filename);

    fs::write(&file_path, &data.content)
        .map_err(|e| format!("Failed to write file: {}", e))?;

    Ok(ExportResult {
        success: true,
        path: Some(file_path.to_string_lossy().to_string()),
    })
}

#[tauri::command]
pub fn get_app_info() -> Result<AppInfo, String> {
    let data_path = get_data_path()?;
    Ok(AppInfo {
        version: env!("CARGO_PKG_VERSION").to_string(),
        name: "Portfolio Generator".to_string(),
        data_path: data_path.to_string_lossy().to_string(),
    })
}

#[derive(Debug, Serialize)]
pub struct AppInfo {
    pub version: String,
    pub name: String,
    pub data_path: String,
}
