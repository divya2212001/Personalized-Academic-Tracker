# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings("ignore")

import joblib

plt.style.use("ggplot")
sns.set_theme(font_scale=1.1)

df = pd.read_csv("student_habits_performance.csv")

print("Shape:", df.shape)
print(df.info())
print(df.isnull().sum())

print("\nDuplicate Rows:", df.duplicated().sum())
df.drop_duplicates(inplace=True)

num_cols = df.select_dtypes(include=np.number).columns
cat_cols = df.select_dtypes(exclude=np.number).columns

df[num_cols] = df[num_cols].fillna(df[num_cols].median())

for col in cat_cols:
    df[col] = df[col].fillna(df[col].mode()[0])

plt.figure(figsize=(8,5))
sns.histplot(df["exam_score"], kde=True, bins=30)
plt.title("Distribution of Exam Score")
plt.show()

plt.figure(figsize=(14,10))
sns.heatmap(df.corr(numeric_only=True), annot=True, cmap="coolwarm", fmt=".2f")
plt.title("Correlation Heatmap")
plt.show()

plt.figure(figsize=(12,6))
sns.boxplot(data=df[num_cols])
plt.xticks(rotation=90)
plt.title("Outlier Detection")
plt.show()


df["productivity_score"] = (
    df["study_hours_per_day"] * 2
    + df["attendance_percentage"] / 10
    + df["mental_health_rating"]
    + df["exercise_frequency"]
    - df["social_media_hours"]
    - df["netflix_hours"]
)

df["sleep_category"] = pd.cut(
    df["sleep_hours"],
    bins=[0,5,7,10],
    labels=["Poor","Average","Good"]
)

from sklearn.preprocessing import LabelEncoder

df["sleep_category"] = LabelEncoder().fit_transform(df["sleep_category"])


X = df[
[
    "study_hours_per_day",
    "attendance_percentage",
    "sleep_hours",
    "mental_health_rating",
    "social_media_hours",
    "netflix_hours",
    "exercise_frequency",
    "productivity_score",
    "sleep_category"
]]

y = df["exam_score"]

print("\nTraining Features:")
print(X.columns.tolist())

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)


from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

models = {
    "Linear Regression": LinearRegression(),
    "Random Forest": RandomForestRegressor(random_state=42),
    "Gradient Boosting": GradientBoostingRegressor(random_state=42)
}

results = []

for name, model in models.items():
    model.fit(X_train_scaled, y_train)
    pred = model.predict(X_test_scaled)

    mae = mean_absolute_error(y_test, pred)
    rmse = np.sqrt(mean_squared_error(y_test, pred))
    r2 = r2_score(y_test, pred)

    results.append([name, mae, rmse, r2])

results_df = pd.DataFrame(
    results,
    columns=["Model", "MAE", "RMSE", "R2 Score"]
)

print("\nModel Comparison:")
print(results_df.sort_values(by="R2 Score", ascending=False).to_string(index=False))


# Hyperparameter Tuning

from sklearn.model_selection import GridSearchCV

params = {
    "n_estimators": [100, 200],
    "max_depth": [5, 10, None],
    "min_samples_split": [2, 5]
}

grid = GridSearchCV(
    RandomForestRegressor(random_state=42),
    params,
    cv=5,
    scoring="r2",
    n_jobs=1
)

grid.fit(X_train_scaled, y_train)

best_model = grid.best_estimator_

print("\nBest Parameters:", grid.best_params_)

final_pred = best_model.predict(X_test_scaled)

print("\nFinal Model Performance")
print("MAE:", mean_absolute_error(y_test, final_pred))
print("RMSE:", np.sqrt(mean_squared_error(y_test, final_pred)))
print("R2 Score:", r2_score(y_test, final_pred))


importance = pd.Series(
    best_model.feature_importances_,
    index=X.columns
).sort_values()

plt.figure(figsize=(10,7))
importance.plot(kind="barh")
plt.title("Feature Importance")
plt.show()

# Actual vs Predicted
plt.figure(figsize=(8,6))
plt.scatter(y_test, final_pred, alpha=0.7)
plt.xlabel("Actual Score")
plt.ylabel("Predicted Score")
plt.title("Actual vs Predicted")
plt.show()

# Cross Validation

from sklearn.model_selection import cross_val_score

cv_scores = cross_val_score(
    best_model,
    scaler.fit_transform(X),
    y,
    cv=5,
    scoring="r2"
)

print("\nCross Validation R2 Scores:", cv_scores)
print("Average CV Score:", cv_scores.mean())


joblib.dump(best_model, "student_model.pkl")
joblib.dump(scaler, "scaler.pkl")

print("\nModel Saved Successfully!")



